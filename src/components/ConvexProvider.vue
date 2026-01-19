<template>
	<div v-if="isReady">
		<slot />
	</div>
	<div v-else class="convex-loading">
		<div class="flex flex-col items-center justify-center gap-2">
			<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
			<p class="text-sm text-muted-foreground">Loading...</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConvexClient, useConvexMutation } from 'convex-vue'
import { useUser, useSession } from '@clerk/vue'
import { Loader2 } from 'lucide-vue-next'
import { provide, ref, watch } from 'vue'
import { api } from '../../convex/_generated/api'

const { user, isLoaded: clerkIsLoaded } = useUser()
const { session, isLoaded: sessionIsLoaded } = useSession()
const isReady = ref(false)

const convex = useConvexClient()
provide('convex', convex)

const { mutate: updateUserData } = useConvexMutation(api.users.updateUserData)

async function updateAuth() {
	if (!clerkIsLoaded.value || !sessionIsLoaded.value) {
		return
	}

	if (user.value && session.value) {
		try {
			const token = await session.value.getToken({ template: 'convex' })
			convex.setAuth(async () => token)

			await updateUserData({
				clerkId: user.value.id,
				email: user.value.primaryEmailAddress?.emailAddress || '',
				name: `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim()
			})
		} catch (error) {
			console.error('Error setting up Convex authentication:', error)
		}
	} else {
		convex.close()
	}

	isReady.value = true
}

watch([user, session, clerkIsLoaded, sessionIsLoaded], updateAuth, {
	immediate: true
})
</script>

<style scoped>
.convex-loading {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 200px;
	padding: 20px;
}
</style>
