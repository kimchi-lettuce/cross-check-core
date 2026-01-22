import { v } from 'convex/values'
import { mutation } from '../_generated/server'
import { z } from 'zod'
import { withAuth } from '../utils/auth'

/** Used to validate the data (client and server side) submitted by the client
 * for a new resource submission */
export const resourceSubmissionSchema = z.object({
	type: z.enum(['book', 'sermon', 'podcast', 'article'], {
		required_error: 'Please select a resource type'
	}),
	title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
	author: z.string().min(1, 'Author is required').max(100, 'Author name is too long').optional(),
	url: z.string().url('Must be a valid URL').optional(),
	noteToReviewer: z.string().min(1, 'Note to reviewer is required').max(1000, 'Note is too long').optional(),
	orgId: z.string().min(1, 'Organization ID is required')
})

export const addResourceSubmission = mutation({
	args: {
		userId: v.string(),
		type: v.union(v.literal('book'), v.literal('sermon'), v.literal('podcast'), v.literal('article')),
		title: v.string(),
		author: v.optional(v.string()),
		url: v.optional(v.string()),
		noteToReviewer: v.optional(v.string()),
		orgId: v.id('orgs')
	},
	handler: async (ctx, args) => {
		return withAuth({ ctx, args, validationSchema: resourceSubmissionSchema }, async (ctx, args) => {
			// Insert the new resource submission
			const submissionId = await ctx.db.insert('resourceSubmissions', {
				type: args.type,
				title: args.title,
				author: args.author,
				url: args.url,
				noteToReviewer: args.noteToReviewer,
				submittedBy: args.userId,
				orgId: args.orgId,
				status: 'pending'
			})

			console.log('Resource submission created with id', submissionId)
			return submissionId
		})
	}
})
