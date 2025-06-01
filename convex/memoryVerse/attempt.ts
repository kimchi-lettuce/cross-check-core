import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { internal } from '../_generated/api'
import { z } from 'zod'
import { withAuth } from '../utils/auth'

// Schema for validating attempt creation arguments
const createAttemptSchema = z.object({
	userId: z.string(),
	verseReference: z.string().regex(/^[A-Za-z0-9\s:.-]+$/, 'Invalid verse reference format'),
	submittedText: z.string().min(1, 'Submitted text is too short').max(1000, 'Submitted text is too long')
})

/** Call to create a new attempt for a user's bible verse entry. This triggers
 * an internal action that runs in the background to evaluate the attempt */
export const createAttempt = mutation({
	args: {
		userId: v.string(),
		bibleEntryId: v.id('userBibleEntries'),
		/** The user's attempt at the verse */
		submittedText: v.string()
	},
	returns: v.id('verseAttempts'),
	handler: (ctx, args) => {
		return withAuth({ ctx, args, validationSchema: createAttemptSchema }, async (ctx, args) => {
			// Insert the attempt with pending status
			const attemptId = await ctx.db.insert('verseAttempts', {
				userId: args.userId,
				bibleEntryId: args.bibleEntryId,
				submittedText: args.submittedText,
				status: 'pending'
			})

			// Schedule the evaluation action
			await ctx.scheduler.runAfter(0, internal.memoryVerse.evaluation.evaluateVerse, {
				attemptId,
				bibleEntryId: args.bibleEntryId,
				submittedText: args.submittedText
			})

			console.log('Memory verse attempt created with id', attemptId)
			return attemptId
		})
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
