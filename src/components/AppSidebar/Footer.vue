<script setup lang="ts">
import { UserButton } from '@clerk/vue'
import { SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Headset } from 'lucide-vue-next'
import AppMenuLink from './AppMenuLink.vue'
</script>
<template>
	<SidebarFooter>
		<SidebarMenu>
			<AppMenuLink text="Contact Us" path="/support">
				<template #icon>
					<Headset class="size-4" />
				</template>
			</AppMenuLink>

			<SidebarMenuItem class="flex justify-center py-2">
				<UserButton />
			</SidebarMenuItem>
		</SidebarMenu>
	</SidebarFooter>
</template>
