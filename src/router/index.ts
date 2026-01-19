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

export default router
