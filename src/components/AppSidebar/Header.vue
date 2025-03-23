<script setup lang="ts">
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar'
import { ref } from 'vue'
import { ChevronsUpDown } from 'lucide-vue-next'

const activeTeam = ref({
	name: 'Acme!',
	logo: 'LogoIcon',
	plan: 'Pro123'
})
</script>

<template>
	<SidebarHeader>
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton 
					size="lg" 
					class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					@click="$router.push('/')"
				>
					<div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
						<component :is="activeTeam.logo" class="size-4" />
					</div>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-semibold">CrossCheck</span>
						<span class="truncate text-xs">St Georges Anglican Hurstville</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarHeader>
</template>
