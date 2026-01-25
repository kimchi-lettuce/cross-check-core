<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useUser, SignIn, SignUp } from '@clerk/vue'
import { Loader2 } from 'lucide-vue-next'
import Toaster from '@/components/ui/toast/Toaster.vue'
import ConvexProvider from './components/ConvexProvider.vue'
import AppSidebar from '@/components/AppSidebar/index.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import Inset from '@/layouts/AuthenticatedLayout/Inset.vue'

const { user, isLoaded } = useUser()
const currentAuthPage = ref<'sign-in' | 'sign-up'>('sign-in')

function updateAuthPageFromHash() {
	const hash = window.location.hash
	if (hash === '#/sign-up') {
		currentAuthPage.value = 'sign-up'
	} else {
		currentAuthPage.value = 'sign-in'
	}
}

onMounted(() => {
	updateAuthPageFromHash()
	window.addEventListener('hashchange', updateAuthPageFromHash)
})

onUnmounted(() => {
	window.removeEventListener('hashchange', updateAuthPageFromHash)
})

watch(user, newUser => {
	if (newUser) {
		window.location.hash = ''
	}
})
</script>

<template>
	<Toaster />

	<div v-if="!isLoaded" class="loading-container">
		<div class="flex flex-col items-center justify-center gap-2">
			<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
			<p class="text-sm text-muted-foreground">Loading...</p>
		</div>
	</div>

	<div v-else-if="!user" class="auth-container">
		<SignIn v-if="currentAuthPage === 'sign-in'" />
		<SignUp v-else-if="currentAuthPage === 'sign-up'" />
	</div>

	<ConvexProvider v-else>
		<SidebarProvider>
			<div class="flex h-screen w-screen">
				<AppSidebar />
				<Inset>
					<RouterView />
				</Inset>
			</div>
		</SidebarProvider>
	</ConvexProvider>
</template>

<style scoped>
.loading-container,
.auth-container {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	background-color: hsl(var(--background));
}
</style>
