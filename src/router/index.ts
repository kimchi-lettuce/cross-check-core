import { useAuth } from '@clerk/vue'
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
			path: '/memory-verse',
			name: 'memory-verse',
			component: () => import('../views/MemoryVerseView.vue'),
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
router.beforeEach(to => {
	console.log(`%c🚀 Running navigation guard for navigation to: ${String(to.fullPath)}`, 'color: #3b82f6; font-weight: bold;')

	const { isSignedIn, isLoaded } = useAuth()
	// Get the original destination path
	const redirectPath = to.query.redirect?.toString() || to.path

	if (!isLoaded.value && to.name !== 'loading') {
		return { name: 'loading', query: { redirect: redirectPath } }
	}

	if (to.meta.requiresAuth && !isSignedIn.value) {
		return { name: 'auth', query: { redirect: redirectPath } }
	}

	// Implicitly continue navigation by not returning anything
})

export default router
