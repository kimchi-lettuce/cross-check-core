<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { auth } from '@/lib/firebaseConfig'
import { ChevronsUpDown, LogOut, ChevronRight, Headset } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const data = ref({
	user: {
		avatar: 'https://github.com/shadcn.png'
	}
})
</script>
<template>
	<SidebarFooter>
		<SidebarMenu>
			<SidebarMenuItem>
				<RouterLink to="/support">
					<SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between flex flex-row">
						<div class="size-8 min-w-8 flex items-center justify-center rounded-lg">
							<Headset class="size-4" />
						</div>
						<span class="truncate">Support & Feedback</span>
						<div class="flex-1" />
						<ChevronRight class="size-4" />
					</SidebarMenuButton>
				</RouterLink>
			</SidebarMenuItem>

			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger as-child>
						<SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar class="h-8 w-8 rounded-lg">
								<AvatarImage :src="data.user.avatar" />
								<AvatarFallback class="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{{ authStore.user?.displayName }}</span>
								<span class="truncate text-xs">{{ authStore.user?.email }}</span>
							</div>
							<ChevronsUpDown class="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
						<DropdownMenuItem @click="auth.signOut()">
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</template>
