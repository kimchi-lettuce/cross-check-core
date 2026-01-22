import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	/** Stores Bible verses that users have saved for memorization. Users
	 * manually enter all verse information themselves */
	userBibleEntries: defineTable({
		/** Unique identifier of the user who saved this verse */
		userId: v.string(),
		/** User-defined reference to the Bible verse (e.g., "John 3:16-20",
		 * "Psalm 23:1-6") */
		title: v.string(),
		/** User-defined Bible translation used (e.g., "ESV", "NIV", "KJV",
		 * "NASB") */
		translation: v.string(),
		/** User-entered text of the verse. Users manually type or paste the
		 * verse text themselves, not from any API */
		text: v.string()
	})
		.index('by_userId', ['userId'])
		.index('by_title', ['title']),

	// Track individual verse attempts
	verseAttempts: defineTable({
		userId: v.string(),
		/** Links the attempt to a user's specific Bible entry */
		bibleEntryId: v.id('userBibleEntries'),
		submittedText: v.string(),
		status: v.union(v.literal('pending'), v.literal('evaluated'), v.literal('failed')),
		score: v.optional(v.number()),
		feedback: v.optional(v.string()),
		error: v.optional(v.string())
	})
		.index('by_userId', ['userId'])
		.index('by_bibleEntryId', ['bibleEntryId']),

	/** Users of the platform with their profile information */
	users: defineTable({
		/** Display name for the user */
		name: v.string(),
		/** Email address for authentication */
		email: v.string(),
		/** Optional profile image URL */
		avatarUrl: v.optional(v.string()),
		/** Communities this user belongs to */
		communityMemberships: v.array(
			v.object({
				communityId: v.id('communities'),
				/** Role within the community */
				role: v.union(v.literal('member'), v.literal('moderator'), v.literal('admin'))
			})
		)
	}).index('by_email', ['email']),

	/** Learning communities like churches, study groups, book clubs, etc. */
	communities: defineTable({
		/** Community name */
		name: v.string(),
		/** Optional description of the community */
		description: v.optional(v.string()),
		/** Settings for resource validation requirements */
		validationSettings: v.object({
			/** Minimum number of approvals needed for a resource to be validated */
			minApprovalsRequired: v.number(),
			/** Whether resources need approval before being visible */
			requiresPreApproval: v.boolean()
		})
	}),

	/** Digital resources shared within communities */
	resources: defineTable({
		/** Type of the resource */
		type: v.union(v.literal('video'), v.literal('book'), v.literal('article'), v.literal('sermon'), v.literal('podcast'), v.literal('pdf'), v.literal('personal_note')),
		/** Resource title */
		title: v.string(),
		/** Author or creator of the resource */
		author: v.optional(v.string()),
		/** URL for online resources */
		url: v.optional(v.string()),
		/** File storage ID for uploaded resources */
		fileId: v.optional(v.id('_storage')),
		/** Rich description or summary */
		description: v.optional(v.string()),
		/** User who shared this resource */
		sharedBy: v.id('users'),
		/** Communities this resource is shared with */
		communityIds: v.array(v.id('communities')),
		/** Current validation status */
		validationStatus: v.union(v.literal('pending'), v.literal('approved'), v.literal('needs_review'), v.literal('rejected')),
		/** Vector embedding for semantic search of resource content */
		contentEmbedding: v.optional(v.array(v.number())),
		/** Metadata for different resource types */
		metadata: v.optional(
			v.object({
				/** Duration for video/audio content (in seconds) */
				duration: v.optional(v.number()),
				/** Page count for books/PDFs */
				pageCount: v.optional(v.number()),
				/** Publication date */
				publishedDate: v.optional(v.string())
			})
		)
	})
		.index('by_community_and_status', ['communityIds', 'validationStatus'])
		.index('by_shared_by', ['sharedBy'])
		.index('by_type', ['type'])
		.vectorIndex('by_content_embedding', {
			vectorField: 'contentEmbedding',
			dimensions: 1536
		}),

	/** Resource requests posted on the community notice board */
	resourceRequests: defineTable({
		/** What the user is looking for */
		title: v.string(),
		/** Detailed description of the request */
		description: v.string(),
		/** User making the request */
		requestedBy: v.id('users'),
		/** Community where this request was posted */
		communityId: v.id('communities'),
		/** Current status of the request */
		status: v.union(v.literal('open'), v.literal('fulfilled'), v.literal('closed')),
		/** Resources that have been suggested in response to this request */
		suggestedResourceIds: v.array(v.id('resources')),
		/** Vector embedding for semantic matching with resources */
		requestEmbedding: v.optional(v.array(v.number()))
	})
		.index('by_community_and_status', ['communityId', 'status'])
		.index('by_requested_by', ['requestedBy'])
		.vectorIndex('by_request_embedding', {
			vectorField: 'requestEmbedding',
			dimensions: 1536
		}),

	/** Comments and discussions on resources with threading support */
	comments: defineTable({
		/** The resource this comment is about */
		resourceId: v.id('resources'),
		/** User who wrote the comment */
		authorId: v.id('users'),
		/** Comment content */
		content: v.string(),
		/** Parent comment for threading (null for top-level comments) */
		parentCommentId: v.optional(v.id('comments')),
		/** For video timestamps - specific time in seconds */
		timestampSeconds: v.optional(v.number()),
		/** Whether this is a timestamp annotation vs general comment */
		isTimestampAnnotation: v.boolean(),
		/** Vector embedding for semantic search of comment content */
		contentEmbedding: v.optional(v.array(v.number())),
		/** Upvote/downvote score */
		score: v.number()
	})
		.index('by_resource', ['resourceId'])
		.index('by_author', ['authorId'])
		.index('by_parent', ['parentCommentId'])
		.index('by_resource_and_timestamp', ['resourceId', 'timestampSeconds'])
		.vectorIndex('by_content_embedding', {
			vectorField: 'contentEmbedding',
			dimensions: 1536
		}),

	/** Community ratings/validations of resources */
	resourceRatings: defineTable({
		/** Resource being rated */
		resourceId: v.id('resources'),
		/** User providing the rating */
		userId: v.id('users'),
		/** Approval or disapproval */
		rating: v.union(v.literal('approve'), v.literal('disapprove')),
		/** Optional reason for the rating */
		reason: v.optional(v.string()),
		/** Community context for this rating */
		communityId: v.id('communities')
	})
		.index('by_resource', ['resourceId'])
		.index('by_user', ['userId'])
		.index('by_community', ['communityId'])
		.index('by_resource_and_community', ['resourceId', 'communityId']),

	/** Personal notes users create on resources */
	personalNotes: defineTable({
		/** The resource this note is about */
		resourceId: v.id('resources'),
		/** User who created the note */
		userId: v.id('users'),
		/** Note title */
		title: v.string(),
		/** Note content in markdown format */
		content: v.string(),
		/** Whether this note is shared with the community */
		isShared: v.boolean(),
		/** File storage ID if note was uploaded as PDF */
		fileId: v.optional(v.id('_storage')),
		/** Vector embedding for semantic search of note content */
		contentEmbedding: v.optional(v.array(v.number()))
	})
		.index('by_user', ['userId'])
		.index('by_resource', ['resourceId'])
		.index('by_resource_and_user', ['resourceId', 'userId'])
		.index('by_shared_notes', ['isShared'])
		.vectorIndex('by_content_embedding', {
			vectorField: 'contentEmbedding',
			dimensions: 1536
		}),

	/** Vote tracking for comments (upvotes/downvotes) */
	commentVotes: defineTable({
		/** Comment being voted on */
		commentId: v.id('comments'),
		/** User casting the vote */
		userId: v.id('users'),
		/** Type of vote */
		voteType: v.union(v.literal('upvote'), v.literal('downvote'))
	})
		.index('by_comment', ['commentId'])
		.index('by_user', ['userId'])
		.index('by_comment_and_user', ['commentId', 'userId'])
})
