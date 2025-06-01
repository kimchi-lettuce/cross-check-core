import { GenericMutationCtx, GenericQueryCtx } from 'convex/server'
import { DataModel } from '../_generated/dataModel'
import { ZodSchema } from 'zod'

type AuthCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>

type Params<Ctx extends AuthCtx, Args> = {
	/** Passed to check the underlying `ctx.auth.getUserIdentity()` to validate
	 * that the user is authenticated */
	ctx: Ctx
	/** Passed to check whether the args include a `userId` field and that the
	 * `userId` matches the authenticated user */
	args: Args & { userId?: string }
	/** The role of the user to check against. Default is `user`. */
	role?: 'user'
	/** The Zod schema to further validate the arguments against */
	validationSchema?: ZodSchema
}

/**
 * Higher-order function that wraps mutation/query handlers with authentication
 * and validation. Ensures the user is authenticated, optionally validates
 * userId matches the authenticated user, and validates arguments against a Zod
 * schema.
 *
 * @example
 * ```typescript
 * export const createAttempt = mutation({
 *   args: { userId: v.string(), submittedText: v.string() },
 *   handler: (ctx, args) => {
 *     return withAuth({ ctx, args, validationSchema: createAttemptSchema }, async (ctx, args) => {
 *       // Your authenticated logic here
 *       return await ctx.db.insert('verseAttempts', { ...args, status: 'pending' })
 *     })
 *   }
 * })
 * ```
 */
export async function withAuth<Ctx extends AuthCtx, Args, Return>(
	params: Params<Ctx, Args>,
	/** The function to call with the authenticated context and args */
	fn: (ctx: Ctx, args: Args) => Promise<Return>
): Promise<Return> {
	const { ctx, args, role = 'user', validationSchema } = params
	const identity = await ctx.auth.getUserIdentity()
	if (identity === null) throw new Error('Not authenticated')

	// You might want to make the userId check conditional based on the function's needs
	if (args.userId && args.userId !== identity.subject) {
		throw new Error('User ID does not match authenticated user')
	}

	// Validate the arguments against a custom schema if provided
	if (validationSchema) {
		const result = validationSchema.safeParse(args)
		if (!result.success) throw new Error(result.error.message)
	}

	// Now call the original function
	return await fn(ctx, args)
}

// type AuthCtx = GenericMutationCtx<DataModel> | GenericQueryCtx<DataModel>
// type AuthConfig = { role: 'user' }
// type ProtectedHandler<Ctx extends AuthCtx, Args, Return> = (ctx: Ctx, args: Args) => Promise<Return>

// export function withAuth<Ctx extends AuthCtx, Args, Return>(config: AuthConfig, handler: ProtectedHandler<Ctx, Args, Return>): ProtectedHandler<Ctx, Args, Return> {
// 	return async (ctx: Ctx, args: Args) => {
// 		const identity = await ctx.auth.getUserIdentity()
// 		if (identity === null) throw new Error('Not authenticated')

// 		// @ts-expect-error - Accessing `userId` can't be guaranteed because
// 		// `args` is generic
// 		if (args.userId !== identity.subject) {
// 			throw new Error('User ID does not match authenticated user')
// 		}

// 		// Role check based on the config
// 		if (config.role) {
// 			// TODO: Not yet implemented
// 			// // Assuming user roles are stored in identity.customData or elsewhere
// 			// const userRole = identity.customData?.role as string | undefined // Adapt based on how you store roles
// 			// if (userRole !== config.role) {
// 			// 	// You might want a more specific error here
// 			// 	throw new Error(`Unauthorized: Requires ${config.role} role`)
// 			// }
// 		}

// 		// If all checks pass, execute the original handler
// 		return handler(ctx, args)
// 	}
// }
