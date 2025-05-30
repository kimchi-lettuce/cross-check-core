import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { internal } from '../_generated/api'
import { z } from 'zod'

/** Used to validate the data (client and server side) submitted by the client
 * for a new verse entry */
export const verseEntrySchema = z.object({
	title: z.string().min(2, 'Title is too short').max(100, 'Title is too long'),
	translation: z.string().min(3, 'E.g. ESV/NIV').max(3, 'E.g. ESV/NIV'),
	// Max length of 4000 characters is a good estimate for a chapter of the Bible
	text: z.string().min(1, `Verse content can't be empty`).max(4000, 'Verse content is too long')
})

// Public mutation for client to submit a verse attempt
export const createAttempt = mutation({
	args: {
		userId: v.string(),
		verseReference: v.string(),
		submittedText: v.string()
	},
	returns: v.id('verseAttempts'),
	handler: async (ctx, args) => {
		// TODO: Test this against a not signed in user
		// TODO: Add a authentication wrapper for the handler?
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')

		if (!args.verseReference.match(/^[A-Za-z0-9\s:.-]+$/)) {
			throw new Error('Invalid verse reference format')
		}
		if (args.submittedText.length > 1000) {
			throw new Error('Submitted text is too long')
		}
		if (args.submittedText.length < 5) {
			throw new Error('Submitted text is too short')
		}

		// Insert the attempt with pending status
		const attemptId = await ctx.db.insert('verseAttempts', {
			userId: args.userId,
			verseReference: args.verseReference,
			submittedText: args.submittedText,
			status: 'pending'
		})

		// Update or create entry in userVerses
		// const existing = await ctx.db
		// 	.query('userVerses')
		// 	.withIndex('by_userId', q => q.eq('userId', args.userId).eq('verseReference', args.verseReference))
		// 	.unique()

		// if (existing) {
		// 	await ctx.db.patch(existing._id, { lastAttemptTime: Date.now() })
		// } else {
		// 	await ctx.db.insert('userVerses', {
		// 		userId: args.userId,
		// 		verseReference: args.verseReference,
		// 		isPublic: false, // Default to private
		// 		lastAttemptTime: Date.now()
		// 	})
		// }

		// Schedule the evaluation action
		await ctx.scheduler.runAfter(0, internal.memoryVerse.evaluation.evaluateVerse, {
			attemptId,
			verseReference: args.verseReference,
			submittedText: args.submittedText
		})

		console.log('Memory verse attempt created with id', attemptId)

		return attemptId
	}
})

// Create a query that listens to an attempt
export const listenToAttempt = query({
	args: {
		attemptId: v.optional(v.id('verseAttempts'))
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()
		if (identity === null) throw new Error('Not authenticated')

		if (!args.attemptId) return null
		const attempt = await ctx.db.get(args.attemptId)
		if (!attempt) throw new Error('Attempt not found')
		return attempt
	}
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
