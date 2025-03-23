<script setup lang="ts">
import { onMounted, ref } from 'vue'

// Only show the loading spinner if the loading state is needed to be shown for
// longer than 500ms
const showLoadingSpinner = ref(false)
onMounted(() => setTimeout(() => (showLoadingSpinner.value = true), 500))

// TODO: Add a creating user profile loading state
</script>

<template>
	<div v-if="showLoadingSpinner" class="flex items-center justify-center min-h-screen">
		<div class="text-center">
			<h2 class="text-xl mb-4 font-semibold">Loading</h2>
			<div class="animate-spin h-8 w-8 mx-auto">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M21 12a9 9 0 1 1-6.219-8.56" />
				</svg>
			</div>
		</div>
	</div>
</template>
