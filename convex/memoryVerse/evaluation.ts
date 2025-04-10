import { v } from 'convex/values'
import OpenAI from 'openai'
import { internalAction, internalMutation } from '../_generated/server'
import { internal } from '../_generated/api'

const EVALUATE_VERSE_PROMPT = `You are a Bible verse evaluation assistant. Compare submitted texts with referenced Bible verses and provide a score from 0 to 100 and detailed feedback.

Evaluate the accuracy of the memorization using these specific criteria:
1. Word-for-word accuracy (60% of score)
- Deduct heavily for missing portions of the verse
- A half-complete verse should score no more than 30 points in this category
- Check for exact wording matches

2. Meaning preservation (30% of score)
- Consider if ALL key theological concepts are preserved
- Missing significant portions should result in major deductions
- Incomplete verses significantly impact meaning

3. Proper punctuation and capitalization (10% of score)
- Check for correct commas, periods, and capitalization
- Consider verse-specific punctuation requirements

Important: Incomplete verses should receive significant deductions as they fail to capture the full meaning and message.

Your response must be in valid JSON format:
{
"score": number,
"feedback": "Provide feedback in this format:
- **Overall**: One-sentence summary
- **Strengths**: Brief bullet point
- **To Improve**: Brief bullet point
Use markdown for emphasis."
}`

export const evaluateVerse = internalAction({
	// Because it's an internal action, we can pass in the document data,
	// knowing that it comes from a trusted source
	args: {
		attemptId: v.id('verseAttempts'),
		verseReference: v.string(),
		submittedText: v.string()
	},
	handler: async (ctx, args) => {
		try {
			const openaiApiKey = process.env.OPENAI_API_KEY
			if (!openaiApiKey) throw new Error('OpenAI API key not configured')

			const openai = new OpenAI({ apiKey: openaiApiKey })
			// For your verse evaluation use case: If budget is very tight,
			// gpt-3.5-turbo should work fine If you want more reliable scoring and
			// better theological understanding, gpt-4-turbo-minimal might be worth
			// the cost increase. Consider testing both models to compare accuracy
			// and cost effectiveness
			const completion = await openai.chat.completions.create({
				messages: [
					{
						role: 'system',
						content: EVALUATE_VERSE_PROMPT
					},
					{
						// TODO: What if the user does prompt injection lol
						role: 'user',
						content: `
							Reference: ${args.verseReference}
							Submitted: ${args.submittedText}
	
							Please evaluate this verse attempt according to the criteria.
						`
					}
				],
				model: 'gpt-4o-mini',
				temperature: 0.1,
				response_format: { type: 'json_object' }
			})
			console.log(`Evaluate verse used ${completion.usage?.total_tokens} tokens`)

			const resp = completion.choices[0].message.content
			if (!resp) throw new Error('No response from OpenAI')
			const response = JSON.parse(resp) as { score: number; feedback: string }

			// Update the database with the results
			await ctx.runMutation(internal.memoryVerse.evaluation.updateAttemptWithResults, {
				attemptId: args.attemptId,
				score: response.score,
				feedback: response.feedback
			})
		} catch (error) {
			console.error('Error evaluating verse with id:', args.attemptId, error)

			// Update the database with error information
			await ctx.runMutation(internal.memoryVerse.evaluation.markAttemptFailed, {
				attemptId: args.attemptId,
				error: error instanceof Error ? error.message : 'Unknown error during evaluation'
			})
		}
	}
})

// Internal mutation to update the attempt with results
export const updateAttemptWithResults = internalMutation({
	args: {
		attemptId: v.id('verseAttempts'),
		score: v.number(),
		feedback: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.attemptId, {
			status: 'evaluated',
			score: args.score,
			feedback: args.feedback
		})
		return null
	}
})

// Internal mutation to mark an attempt as failed
export const markAttemptFailed = internalMutation({
	args: {
		attemptId: v.id('verseAttempts'),
		error: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.patch(args.attemptId, {
			status: 'failed',
			error: args.error
		})
		return null
	}
})
