<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'
import { RouterLink } from 'vue-router'
import { cn } from '@/lib/utils'

defineProps<{
	to: string
	class?: HTMLAttributes['class']
}>()
</script>

<template>
	<RouterLink :to="to" :class="cn('transition-colors hover:text-foreground', $props.class)">
		<slot />
	</RouterLink>
</template>
