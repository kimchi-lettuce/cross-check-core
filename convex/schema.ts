import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
	verseEvaluations: defineTable({
		userId: v.string(),
		verseReference: v.string(),
		submittedText: v.string(),
		score: v.number(),
		feedback: v.string(),
		_creationTime: v.number()
	}).index('by_userId', ['userId'])
})
