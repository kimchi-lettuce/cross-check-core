import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { z } from 'zod'
import { withAuth } from '../utils/auth'

export const MAX_ENTRY_LENGTH = 4000

/** Used to validate the data (client and server side) submitted by the client
 * for a new verse entry */
export const verseEntrySchema = z.object({
	title: z.string().min(2, 'Title is too short').max(100, 'Title is too long'),
	translation: z.string().min(3, 'E.g. ESV/NIV').max(3, 'E.g. ESV/NIV'),
	// Max length of 4000 characters is a good estimate for a chapter of the Bible
	text: z.string().min(1, `Verse content can't be empty`).max(MAX_ENTRY_LENGTH, `Verse content is too long (max ${MAX_ENTRY_LENGTH} characters)`)
})

export const addVerseEntry = mutation({
	args: {
		userId: v.string(),
		title: v.string(),
		translation: v.string(),
		text: v.string()
	},
	handler: async (ctx, args) => {
		return withAuth({ ctx, args, validationSchema: verseEntrySchema }, async (ctx, args) => {
			// Insert the new verse entry into userBibleEntries
			const entryId = await ctx.db.insert('userBibleEntries', {
				userId: args.userId,
				title: args.title,
				translation: args.translation,
				text: args.text
			})
			return entryId
		})
	}
})

export const deleteVerseEntry = mutation({
	args: {
		userId: v.string(),
		entryId: v.id('userBibleEntries')
	},
	handler: async (ctx, args) => {
		return withAuth({ ctx, args }, async (ctx, args) => {
			// First verify the entry exists and belongs to the user
			const entry = await ctx.db.get(args.entryId)
			if (!entry) throw new Error('Verse entry not found')
			if (entry.userId !== args.userId) throw new Error('Not authorized to delete this verse entry')

			// Delete the verse entry
			await ctx.db.delete(args.entryId)
			return null
		})
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
