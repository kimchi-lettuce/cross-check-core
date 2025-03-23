import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: () => import('../views/HomeView.vue'),
			meta: { requiresAuth: true }
		},
		{
			path: '/auth',
			name: 'auth',
			component: () => import('../views/AuthView.vue'),
			meta: { noAuth: true }
		},
		{
			path: '/loading',
			name: 'loading',
			component: () => import('../views/LoadingView.vue')
		},
		{
			path: '/support',
			name: 'support',
			component: () => import('../views/SupportView.vue')
		},
		{
			path: '/:pathMatch(.*)*',
			name: 'NotFound',
			component: () => import('../views/NotFound.vue')
		}
	]
})

// Navigation guard using auth store
router.beforeEach((to, from, next) => {
	// const authStore = useAuthStore()

	console.log(`%c🚀 Navigating to: ${String(to.name)}`, 'color: #3b82f6; font-weight: bold;')

	// If the first snapshot of the user data is still loading, then show the
	// initial loading page
	// if (authStore.isLoading) {
	// 	if (to.name !== 'loading') {
	// 		// If found to be navigating to anything that isn't the loading
	// 		// page, force it to navigate to the loading page anyway
	// 		next({ name: 'loading' })
	// 		// If the user was attempting to navigate to the auth page, redirect
	// 		// them to the home page instead
	// 		authStore.onSignInRedirect = to.fullPath === '/auth' ? '/' : to.fullPath
	// 		return
	// 	}
	// }

	// Route authentication protection is handled in `authStore.ts` based on the
	// `onAuthStateChanged` callback
	next()
})

export default router
