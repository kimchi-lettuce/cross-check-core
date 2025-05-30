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
		text: v.string(),
		/** Timestamp when the entry was created */
		_creationTime: v.number()
	})
		.index('by_userId', ['userId'])
		.index('by_title', ['title']),

	// Track individual verse attempts
	verseAttempts: defineTable({
		userId: v.string(),
		verseReference: v.string(),
		submittedText: v.string(),
		status: v.union(v.literal('pending'), v.literal('evaluated'), v.literal('failed')),
		score: v.optional(v.number()),
		feedback: v.optional(v.string()),
		error: v.optional(v.string()),
		_creationTime: v.number()
	})
		.index('by_userId', ['userId'])
		.index('by_verseReference', ['verseReference']),

	// Track which verses users are working on
	userVerses: defineTable({
		userId: v.string(),
		verseReference: v.string(),
		isPublic: v.boolean(),
		lastAttemptTime: v.number()
	})
		.index('by_userId', ['userId'])
		.index('by_public_verses', ['isPublic', 'verseReference'])
})
