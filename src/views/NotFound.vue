<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-4 px-4 text-center h-full">
		<div class="space-y-4">
			<h1 class="text-8xl font-bold tracking-tighter">404</h1>
			<h2 class="text-2xl font-semibold tracking-tight">Page not found</h2>
			<p class="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
		</div>
		<Button variant="default" @click="$router.push('/')">Go back home</Button>
	</div>
</template>
