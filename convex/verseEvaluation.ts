import { action, internalMutation } from './_generated/server'
import { v } from 'convex/values'
import OpenAI from 'openai'
import { internal } from './_generated/api'

export const evaluateVerse = action({
	args: {
		userId: v.string(),
		verseReference: v.string(),
		submittedText: v.string()
	},
	handler: async (ctx, args) => {
		const openaiApiKey = process.env.OPENAI_API_KEY
		if (!openaiApiKey) throw new Error('OpenAI API key not configured')

		const openai = new OpenAI({ apiKey: openaiApiKey })

		const prompt = `You are a Bible verse evaluation assistant. Compare the following submitted text with the referenced Bible verse and provide a score from 0 to 100 and feedback.

		Reference: ${args.verseReference}
		Submitted: ${args.submittedText}

		Evaluate the accuracy of the memorization, considering:
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

		Respond in the following JSON format:
		{
		"score": number,
		"feedback": "Provide feedback in this format:
		- **Overall**: One-sentence summary
		- **Strengths**: Brief bullet point
		- **To Improve**: Brief bullet point
		Use markdown for emphasis."
		}`

		// For your verse evaluation use case: If budget is very tight,
		// gpt-3.5-turbo should work fine If you want more reliable scoring and
		// better theological understanding, gpt-4-turbo-minimal might be worth
		// the cost increase. Consider testing both models to compare accuracy
		// and cost effectiveness
		const completion = await openai.chat.completions.create({
			messages: [{ role: 'user', content: prompt }],
			model: 'gpt-4o-mini',
			temperature: 0.1,
			response_format: { type: 'json_object' }
		})
		console.log(`Evaluate verse used ${completion.usage?.total_tokens} tokens`)
		const resp = completion.choices[0].message.content
		if (!resp) throw new Error('No response from OpenAI')

		const response = JSON.parse(resp) as {
			score: number
			feedback: string
		}

		// Store the evaluation result
		const storeEvaluationMutation = internal.verseEvaluation.storeEvaluation
		if (!storeEvaluationMutation) {
			throw new Error('storeEvaluation mutation not found')
		}

		await ctx.runMutation(storeEvaluationMutation, {
			userId: args.userId,
			verseReference: args.verseReference,
			submittedText: args.submittedText,
			score: response.score,
			feedback: response.feedback
		})

		return response
	}
})

export const storeEvaluation = internalMutation({
	args: {
		userId: v.string(),
		verseReference: v.string(),
		submittedText: v.string(),
		score: v.number(),
		feedback: v.string()
	},
	handler: async (ctx, args) => {
		await ctx.db.insert('verseEvaluations', {
			userId: args.userId,
			verseReference: args.verseReference,
			submittedText: args.submittedText,
			score: args.score,
			feedback: args.feedback
		})
	}
})
