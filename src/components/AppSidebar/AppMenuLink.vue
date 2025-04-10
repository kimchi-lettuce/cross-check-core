<script setup lang="ts">
import { SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
defineProps<{ text: string; path: string }>()
</script>

<template>
	<SidebarMenuItem>
		<RouterLink :to="path" v-slot="{ isActive }">
			<SidebarMenuButton size="md" class="gap-2" :class="{ 'bg-sidebar-accent': isActive }">
				<div class="size-8 min-w-8 flex items-center justify-center rounded-lg">
					<slot name="icon" />
				</div>
				<span class="truncate">{{ text }}</span>
			</SidebarMenuButton>
		</RouterLink>
	</SidebarMenuItem>
</template>
