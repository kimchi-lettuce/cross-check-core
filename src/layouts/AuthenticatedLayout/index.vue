<script setup lang="ts">
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar/index.vue'
import Inset from './Inset.vue'
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
