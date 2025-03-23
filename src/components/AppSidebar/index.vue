<script setup lang="ts">
// import SidebarNavigation from './sidebar/SidebarNavigation.vue'
// import SidebarHeader from './sidebar/SidebarHeader.vue'
// import SidebarFooter from './sidebar/SidebarFooter.vue'
import { Sidebar, SidebarRail, SidebarContent } from '@/components/ui/sidebar'
import Header from './Header.vue'
import Footer from './Footer.vue'
</script>

<template>
	<Sidebar collapsible="icon" class="bg-sidebar">
		<Header />
		<!--<SidebarHeader />-->
		<!--<SidebarNavigation />-->
		<!--<SidebarFooter />-->
		<SidebarContent></SidebarContent>
		<Footer />

		<!-- Allows the user to click on the divider between the siderail and
		the main content to trigger the collapse or expansion of the sidebar -->
		<SidebarRail />
	</Sidebar>
</template>
