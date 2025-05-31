import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { internal } from '../_generated/api'

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
