import { v } from 'convex/values'
import { mutation, query } from '../_generated/server'
import { internal } from '../_generated/api'
import { z } from 'zod'
import { withAuth } from '../utils/auth'
import { MAX_ENTRY_LENGTH } from './entry'

// Schema for validating attempt creation arguments
export const createAttemptSchema = z.object({
	submittedText: z.string().min(1, 'Submitted text is too short').max(MAX_ENTRY_LENGTH, `Submitted text is too long (max ${MAX_ENTRY_LENGTH} characters)`)
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

// If we weren't using convex, you would probably creat your own backend server
// - I need to manage how many instances of my server are running
// - deploy this server to multiple regions. Heroku, netlify handles this for me

// Express node.js http server. using typscript
// - Deploy it onto a service like Heroku, Netlify or something ...
// - as the application gets more complex, does the one http server handle all form of requests.

// - How would you handle authentication?
// - 3rd party auth providers and make requests to them through your node.js server

// Databases: spin up your own amazon AWS SQl database
// - manage your own database connections
