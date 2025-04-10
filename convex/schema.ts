import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	bibleVerses: defineTable({
		reference: v.string(),
		status: v.union(v.literal('pending'), v.literal('retrieved'), v.literal('failed')),
		text: v.optional(v.string()),
		error: v.optional(v.string()),
		translation: v.literal('ESV'), // In case you want to add more translations later
		_creationTime: v.number()
	})
		.index('by_reference', ['reference', 'translation']) // To check if we already have this verse with specific translation
		.index('by_status', ['status']), // Might be useful for cleanup/monitoring

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
