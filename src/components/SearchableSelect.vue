<script setup lang="ts" generic="T">
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Combobox, ComboboxAnchor, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxItemIndicator, ComboboxItem, ComboboxList, ComboboxTrigger } from '@/components/ui/combobox'
import { Check, ChevronsUpDown, Search } from 'lucide-vue-next'

export interface SelectOption<T> {
	key: string
	value: T
	label: string
}

interface Props {
	options: SelectOption<T>[]
	placeholder?: string
	emptyMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Select option...',
	emptyMessage: 'No options found.'
})

const model = defineModel<SelectOption<T> | undefined>()
</script>

<template>
	<Combobox v-model="model" by="label">
		<ComboboxAnchor as-child>
			<ComboboxTrigger as-child>
				<Button variant="outline" class="justify-between">
					{{ model?.label ?? placeholder }}
					<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</ComboboxTrigger>
		</ComboboxAnchor>

		<ComboboxList>
			<div class="relative w-full max-w-sm items-center">
				<ComboboxInput class="pl-9 focus-visible:ring-0 border-0 border-b rounded-none h-10" :placeholder="placeholder" />
				<span class="absolute start-0 inset-y-0 flex items-center justify-center px-3">
					<Search class="size-4 text-muted-foreground" />
				</span>
			</div>

			<ComboboxEmpty class="py-2">{{ emptyMessage }}</ComboboxEmpty>

			<ComboboxGroup class="max-h-[200px] overflow-y-auto">
				<ComboboxItem v-for="option in options" :key="option.key" :value="option">
					{{ option.label }}
					<ComboboxItemIndicator>
						<Check :class="cn('ml-auto h-4 w-4')" />
					</ComboboxItemIndicator>
				</ComboboxItem>
			</ComboboxGroup>
		</ComboboxList>
	</Combobox>
</template>
