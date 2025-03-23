<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
	const paths = route.path.split('/').filter(Boolean)

	// Always start with Home
	const crumbs = [
		{
			name: 'Home',
			path: '/'
		}
	]

	// Add remaining path segments
	paths.forEach((path, index) => {
		const fullPath = '/' + paths.slice(0, index + 1).join('/')
		crumbs.push({
			name: formatBreadcrumb(path),
			path: fullPath
		})
	})

	return crumbs
})

function formatBreadcrumb(path: string) {
	// Convert kebab-case to Title Case
	return path
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
}
</script>

<template>
	<Breadcrumb>
		<BreadcrumbList>
			<template v-for="(crumb, index) in breadcrumbs" :key="index">
				<BreadcrumbItem :class="{ 'hidden md:block': index !== breadcrumbs.length - 1 }">
					<BreadcrumbLink v-if="index < breadcrumbs.length - 1" :to="crumb.path">
						{{ crumb.name }}
					</BreadcrumbLink>
					<BreadcrumbPage v-else>{{ crumb.name }}</BreadcrumbPage>
				</BreadcrumbItem>
				<BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" class="hidden md:block" />
			</template>
		</BreadcrumbList>
	</Breadcrumb>
</template>
