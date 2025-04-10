import './assets/main.css'

import type { Resources, SignedInSessionResource } from '@clerk/types'
import { clerkPlugin } from '@clerk/vue'
import { createConvexVue } from '@convex-vue/core'
import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

if (!PUBLISHABLE_KEY) throw new Error('Add your Clerk Publishable Key to the .env file')
if (!CONVEX_URL) throw new Error('Add your Convex URL to the .env file')

const app = createApp(App)

// Initialize Clerk first
app.use(clerkPlugin, {
	publishableKey: PUBLISHABLE_KEY
})

// Create auth state refs
const isLoading = ref(true)
const isAuthenticated = ref(false)
const session = ref<Resources['session'] | undefined>(undefined)

// Setup Convex Vue with auth state
const convexVue = createConvexVue({
	convexUrl: CONVEX_URL,
	auth: {
		isLoading,
		isAuthenticated,
		getToken: async ({ forceRefreshToken }) => {
			try {
				return await session.value?.getToken({
					template: 'convex',
					skipCache: forceRefreshToken
				})
			} catch (error) {
				return null
			}
		}
	}
})

app.use(convexVue)
app.use(router)

app.mount('#app')

export function clerkListener(arg: { session?: SignedInSessionResource | null | undefined }) {
	isLoading.value = false
	session.value = arg.session
	isAuthenticated.value = !!arg.session
	console.debug('✅ Injecting clerk session auth into `createConvexVue`')
}
