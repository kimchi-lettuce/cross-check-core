import { v } from 'convex/values'
import { action, internalAction, mutation } from '../_generated/server'
import { internal } from '../_generated/api'

const ESV_API_URL = 'https://api.esv.org/v3/passage/text'

// Public mutation for client to request a verse
export const requestVerse = mutation({
	args: {
		book: v.string(),
		chapter: v.number(),
		verse: v.number()
	},
	handler: async (ctx, args) => {
		// Validate the user is authenticated
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) throw new Error('Not authenticated')

		// Construct the reference string
		const reference = `${args.book} ${args.chapter}:${args.verse}`

		// Check if the verse already exists in the database
		const existingVerse = await ctx.db
			.query('bibleVerses')
			.withIndex('by_reference', q => q.eq('reference', reference).eq('translation', 'ESV'))
			.unique()
		if (existingVerse) return existingVerse._id

		// Create a verse request entry
		const verseId = await ctx.db.insert('bibleVerses', {
			reference,
			status: 'pending',
			translation: 'ESV'
		})

		// Schedule the fetch action
		await ctx.scheduler.runAfter(0, internal.memoryVerse.getVerse.fetchVerse, {
			reference
		})

		return verseId
	}
})

type ESVPassageMeta = {
	canonical: string
	chapter_start: [number, number]
	chapter_end: [number, number]
	prev_verse: number
	next_verse: number
	prev_chapter: [number, number]
	next_chapter: [number, number]
}

type ESVResponse = {
	query: string
	canonical: string
	parsed: [number, number][]
	passage_meta: ESVPassageMeta[]
	passages: string[]
}

export const fetchVerse = internalAction({
	args: {
		/** String in the format of "Book Chapter:Verse" */
		reference: v.string()
	},
	handler: async (ctx, args) => {
		if (!process.env.ESV_SCRIPTURE_API) {
			throw new Error('ESV API key not configured')
		}

		// TODO: Add a limit

		// Construct the URL with all formatting parameters set to false
		const params = new URLSearchParams({
			q: args.reference,
			'include-passage-references': 'false',
			'include-verse-numbers': 'false',
			'include-first-verse-numbers': 'false',
			'include-footnotes': 'false',
			'include-footnote-body': 'false',
			'include-headings': 'false'
		})

		try {
			const response = await fetch(`${ESV_API_URL}/?${params}`, {
				headers: {
					Authorization: `Token ${process.env.ESV_SCRIPTURE_API}`
				}
			})

			if (!response.ok) {
				throw new Error(`ESV API error: ${response.status} ${response.statusText}`)
			}

			const data = (await response.json()) as ESVResponse

			// Check if ESV normalized to a different verse
			if (data.query.toLowerCase() !== args.reference.toLowerCase()) {
				throw new Error(`Invalid verse reference: ${args.reference}. ` + `This chapter only goes up to ${data.canonical}`)
			}

			// The API returns an array of passages, we'll take the first one
			// and clean up any extra whitespace or trailing (ESV)
			const verseText =
				data.passages[0]
					?.trim()
					// Optionally normalize quotes if you want to
					?.replace(/[\u201c\u201d]/g, '"') ?? ''

			if (!verseText) {
				throw new Error(`No verse found for reference: ${args.reference}`)
			}

			return { text: verseText }
		} catch (error) {
			console.error('Error fetching verse:', error)
			throw new Error(`Failed to fetch verse: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}
})
