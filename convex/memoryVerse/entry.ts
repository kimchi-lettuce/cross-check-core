import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { z } from 'zod'

/** Used to validate the data (client and server side) submitted by the client
 * for a new verse entry */
export const verseEntrySchema = z.object({
	title: z.string().min(2, 'Title is too short').max(100, 'Title is too long'),
	translation: z.string().min(3, 'E.g. ESV/NIV').max(3, 'E.g. ESV/NIV'),
	// Max length of 4000 characters is a good estimate for a chapter of the Bible
	text: z.string().min(1, `Verse content can't be empty`).max(4000, 'Verse content is too long')
})

export const addVerseEntry = mutation({
	args: {
		userId: v.string(),
		title: v.string(),
		translation: v.string(),
		text: v.string()
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')

		// Check that the userId matches the authenticated user
		if (args.userId !== identity.subject) {
			throw new Error('User ID does not match authenticated user')
		}

		// Validate the data
		const parsed = verseEntrySchema.safeParse(args)
		if (!parsed.success) {
			throw new Error('Invalid data for new verse entry: ' + JSON.stringify(parsed.error, null, 2))
		}

		// Insert the new verse entry into userBibleEntries
		const entryId = await ctx.db.insert('userBibleEntries', {
			userId: args.userId,
			title: args.title,
			translation: args.translation,
			text: args.text
		})

		return entryId
	}
})

export const getSavedVerses = query({
	args: {
		userId: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		// If the `userId` is not provided, return an empty array
		if (!args.userId) return []
		const userId = args.userId

		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')

		if (userId !== identity.subject) {
			throw new Error('User ID does not match authenticated user')
		}

		const savedVerses = await ctx.db
			.query('userBibleEntries')
			.withIndex('by_userId', q => q.eq('userId', userId))
			.collect()

		return savedVerses
	}
})
