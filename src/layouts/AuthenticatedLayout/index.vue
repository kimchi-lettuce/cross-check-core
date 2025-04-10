<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar/index.vue'
import { SidebarProvider } from '@/components/ui/sidebar'
import { clerkListener } from '@/main'
import { useClerk } from '@clerk/vue'
import { watch } from 'vue'
import Inset from './Inset.vue'

// FIXME: This should go into App.vue, to account for log out
const clerk = useClerk()
watch(
	() => clerk.value?.session,
	session => clerkListener({ session }),
	{ immediate: true }
)
</script>

<template>
	<SidebarProvider>
		<div class="flex h-screen w-screen">
			<AppSidebar />
			<Inset>
				<slot />
			</Inset>
		</div>
	</SidebarProvider>
</template>
