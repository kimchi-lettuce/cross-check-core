# Agent Guide

## Stack
- Vue 3 + Vite + TypeScript
- Tailwind CSS + shadcn-vue (components added individually via CLI: `npx shadcn-vue@latest add <component>`, built on Radix Vue)
- Convex backend
- Clerk auth

## Coding Style
- Use tabs for indentation in TS/JS/Vue.
- Prefer function declarations over const arrow functions.
- Use `/** */` for doc comments and `//` for inline notes.
- Wrap comments to 100 characters.

## Convex Rules
- Use the object-based function syntax: define Convex functions with `args`, `returns`, and `handler` properties. Example:
  ```ts
  export const myQuery = query({
    args: { userId: v.id('users') },
    returns: v.union(v.null(), v.id('users')),
    handler: async (ctx, args) => {
      // function logic
    }
  })
  ```
- Always include validators for both `args` and `returns` using `v.*` from `convex/values` (e.g., `v.string()`, `v.id('tableName')`, `v.null()`).
- Prefer `v.id('tableName')` over `v.string()` for Convex document IDs. While IDs are strings at runtime, using `v.id('tableName')` provides better type safety and makes it explicit which table the ID references.
- Avoid `filter`; use indexes with `withIndex`.
- Use `v.null()` for null returns.

## When Adding Features
- Keep data models generic and UI copy community-specific.
- Prefer incremental UX, avoid complex forum-like flows.
