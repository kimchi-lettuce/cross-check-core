<script setup lang="ts">
import { cn } from '@/lib/utils'
import { ProgressIndicator, ProgressRoot, type ProgressRootProps } from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'

interface Props extends ProgressRootProps {
	class?: HTMLAttributes['class']
	indicatorClass?: HTMLAttributes['class'] // Add new prop for indicator styling
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: 0
})

const delegatedProps = computed(() => {
	const { class: _, indicatorClass: __, ...delegated } = props
	return delegated
})
</script>

<template>
	<ProgressRoot v-bind="delegatedProps" :class="cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', props.class)">
		<ProgressIndicator
			:class="cn('h-full w-full flex-1 bg-primary transition-all', props.indicatorClass)"
			:style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
		/>
	</ProgressRoot>
</template>
