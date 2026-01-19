import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

const accountValidator = v.object({
	_id: v.id('accounts'),
	_creationTime: v.number(),
	clerkId: v.string(),
	email: v.string(),
	name: v.optional(v.string()),
	createdAt: v.number()
})

export const getCurrentUser = query({
	args: {},
	returns: v.union(v.null(), accountValidator),
	handler: async ctx => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) return null

		return await ctx.db
			.query('accounts')
			.withIndex('by_clerk_id', q => q.eq('clerkId', identity.subject))
			.first()
	}
})

export const updateUserData = mutation({
	args: {
		clerkId: v.string(),
		email: v.string(),
		name: v.string()
	},
	returns: v.id('accounts'),
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity()
		if (!identity) throw new Error('Not authenticated')

		if (identity.subject !== args.clerkId) {
			throw new Error('Unauthorized')
		}

		const existingAccount = await ctx.db
			.query('accounts')
			.withIndex('by_clerk_id', q => q.eq('clerkId', args.clerkId))
			.first()

		if (existingAccount) {
			await ctx.db.patch(existingAccount._id, {
				email: args.email,
				name: args.name
			})
			return existingAccount._id
		}

		return await ctx.db.insert('accounts', {
			clerkId: args.clerkId,
			email: args.email,
			name: args.name,
			createdAt: Date.now()
		})
	}
})
