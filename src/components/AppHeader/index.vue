<script setup lang="ts">
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import ShareResourceDrawer from '@/layouts/AuthenticatedLayout/ShareResourceDrawer.vue'
import PageBreadcrumbs from './PageBreadcrumb.vue'
</script>

<template>
	<header class="flex justify-between pr-4 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
		<div class="flex items-center gap-2 px-4">
			<SidebarTrigger class="-ml-1" />
			<Separator orientation="vertical" class="mr-2 h-4" />
			<PageBreadcrumbs />
		</div>

		<ShareResourceDrawer />
	</header>
</template>
