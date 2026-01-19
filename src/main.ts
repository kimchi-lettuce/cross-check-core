import './assets/main.css'

import { clerkPlugin } from '@clerk/vue'
import { convexVue } from 'convex-vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const CONVEX_URL = import.meta.env.VITE_CONVEX_URL

if (!PUBLISHABLE_KEY) throw new Error('Add your Clerk Publishable Key to the .env file')
if (!CONVEX_URL) throw new Error('Add your Convex URL to the .env file')

const app = createApp(App)

app.use(clerkPlugin, {
	publishableKey: PUBLISHABLE_KEY
})

app.use(convexVue, {
	url: CONVEX_URL
})
app.use(router)

app.mount('#app')
