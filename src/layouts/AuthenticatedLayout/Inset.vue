<script setup lang="ts">
import { useSidebar } from '@/components/ui/sidebar/utils'
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue'
import AppHeader from '@/components/AppHeader/index.vue'
const { state } = useSidebar()
</script>

<template>
	<SidebarInset>
		<div
			class="flex flex-col overflow-hidden transition-[width] duration-200 ease-linear"
			:style="{
				width: state === 'collapsed' ? 'calc(100vw - var(--sidebar-width-icon))' : 'calc(100vw - var(--sidebar-width))'
			}"
		>
			<AppHeader />
			<div class="flex-1 p-4 pt-2 overflow-y-auto">
				<slot />
			</div>
		</div>
	</SidebarInset>
</template>
