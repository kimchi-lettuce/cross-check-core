<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarMenu, SidebarRail } from '@/components/ui/sidebar'
import { Home, Book } from 'lucide-vue-next'
import AppMenuLink from './AppMenuLink.vue'
import Footer from './Footer.vue'
import Header from './Header.vue'
</script>

<template>
	<Sidebar collapsible="icon" class="bg-sidebar">
		<Header />
		<!-- <SidebarContent>
			<div class="flex flex-col gap-2 p-4">
				<Button variant="ghost" class="w-full justify-start" @click="router.push('/')">
					<Home class="mr-2 h-4 w-4" />
					Home
				</Button>
				<Button variant="ghost" class="w-full justify-start" @click="router.push('/memory-verse')">
					<Book class="mr-2 h-4 w-4" />
					Memory Verse
				</Button>
			</div>
		</SidebarContent> -->

		<SidebarContent class="p-2">
			<SidebarMenu class="gap-0">
				<AppMenuLink text="Home" path="/">
					<template #icon>
						<Home class="size-4" />
					</template>
				</AppMenuLink>
				<AppMenuLink text="Memory Verse" path="/memory-verse">
					<template #icon>
						<Book class="size-4" />
					</template>
				</AppMenuLink>
			</SidebarMenu>
		</SidebarContent>

		<Footer />

		<!-- Allows the user to click on the divider between the siderail and
		the main content to trigger the collapse or expansion of the sidebar -->
		<SidebarRail />
	</Sidebar>
</template>
