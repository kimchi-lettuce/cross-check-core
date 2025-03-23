<script lang="ts" setup>
import type { DialogContentEmits, DialogContentProps } from 'radix-vue'
import type { HtmlHTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useForwardPropsEmits } from 'radix-vue'
import { DrawerContent, DrawerPortal } from 'vaul-vue'
import DrawerOverlay from './DrawerOverlay.vue'

interface Props extends DialogContentProps {
	class?: HtmlHTMLAttributes['class']
	direction?: 'bottom' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
	direction: 'bottom'
})
const emits = defineEmits<DialogContentEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerContent
			v-bind="forwarded"
			:class="
				cn(
					'fixed z-50 border bg-background',
					direction === 'bottom' && 'inset-x-0 bottom-0 mt-24 flex h-auto flex-col rounded-t-[10px]',
					direction === 'right' && 'right-0 top-0 h-full w-[400px] rounded-l-[10px]',
					props.class
				)
			"
		>
			<!-- Hide the drag indicator when direction is not 'bottom' -->
			<div v-if="direction === 'bottom'" class="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
			<slot />
		</DrawerContent>
	</DrawerPortal>
</template>
