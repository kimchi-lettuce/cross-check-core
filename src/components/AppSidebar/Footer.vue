<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { useToast } from '@/components/ui/toast/use-toast'
import { ChevronsUpDown, LogOut, Headset } from 'lucide-vue-next'
import { ref } from 'vue'
import AppMenuLink from './AppMenuLink.vue'
import { useClerk } from '@clerk/vue'

const data = ref({
	user: {
		avatar: 'https://github.com/shadcn.png'
	}
})

const clerk = useClerk()
const { toast } = useToast()

function handleLogout() {
	if (!clerk.value) {
		return toast({
			title: 'Error',
			description: 'Unable to sign out. Please try again.'
		})
	}
	return clerk.value.signOut()
}
</script>
<template>
	<SidebarFooter>
		<SidebarMenu>
			<AppMenuLink text="Contact Us" path="/support">
				<template #icon>
					<Headset class="size-4" />
				</template>
			</AppMenuLink>

			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger as-child>
						<SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
							<Avatar class="h-8 w-8 rounded-lg">
								<AvatarImage :src="data.user.avatar" />
								<AvatarFallback class="rounded-lg">CN</AvatarFallback>
							</Avatar>
							<div class="grid flex-1 text-left text-sm leading-tight">
								<span class="truncate font-semibold">{{ 'TODO:' }}</span>
								<span class="truncate text-xs">{{ 'TODO:' }}</span>
							</div>
							<ChevronsUpDown class="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" side="bottom" align="end" :side-offset="4">
						<DropdownMenuItem @click="handleLogout">
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</template>
