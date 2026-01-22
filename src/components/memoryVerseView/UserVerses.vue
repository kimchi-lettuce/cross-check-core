<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area/index'
import { Skeleton } from '@/components/ui/skeleton'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import { api } from '../../../convex/_generated/api'
import { useAuth } from '@clerk/vue'
import { BookOpen, Trash2 } from 'lucide-vue-next'
import type { Doc, Id } from 'convex/_generated/dataModel'

const props = defineProps<{ selectedVerse?: Doc<'userBibleEntries'> | null }>()
const emit = defineEmits<{ (e: 'select', verse: Doc<'userBibleEntries'> | null): void }>()

const { userId } = useAuth()
const { data: savedVerses, isLoading } = useConvexQuery(api.memoryVerse.entry.getSavedVerses, {
	userId: userId.value as Id<'users'> | undefined
})

const { mutate: deleteVerseMutation, isLoading: isDeleting, error: deleteError } = useConvexMutation(api.memoryVerse.entry.deleteVerseEntry)

const isSelected = (verse: Doc<'userBibleEntries'>) => props.selectedVerse?._id === verse._id

const deleteVerse = async (verse: Doc<'userBibleEntries'>, event: Event) => {
	// Prevent selecting the verse when clicking delete
	event.stopPropagation()
	if (!userId.value) return
	await deleteVerseMutation({ userId: userId.value, entryId: verse._id })
	emit('select', null)
}
</script>

<template>
	<ScrollArea class="h-[300px]">
		<div class="space-y-2">
			<!-- Loading state -->
			<div v-if="isLoading" class="space-y-2">
				<div v-for="i in 3" :key="i" class="flex items-center space-x-2 p-2">
					<Skeleton class="w-4 h-4 rounded" />
					<Skeleton class="h-4 flex-1" />
				</div>
			</div>

			<!-- Empty state -->
			<div v-else-if="!savedVerses || savedVerses.length === 0" class="text-center py-8">
				<BookOpen class="w-8 h-8 mx-auto text-muted-foreground mb-2" />
				<p class="text-sm text-muted-foreground">No saved verses yet</p>
				<p class="text-xs text-muted-foreground mt-1">Add a new verse to get started</p>
			</div>

			<!-- Verses list -->
			<Button
				v-else
				v-for="verse in savedVerses"
				:key="verse._id"
				:variant="isSelected(verse) ? 'selected' : 'ghost'"
				class="w-full flex flex-row justify-between py-2"
				@click="emit('select', verse)"
			>
				<div class="flex flex-row items-center gap-2">
					<BookOpen class="w-4 h-4 mr-2 flex-shrink-0" />
					<span class="truncate">{{ verse.title }}</span>
				</div>
				<Button variant="ghost" class="px-0 text-red-400 hover:text-red-700" @click="deleteVerse(verse, $event)">
					<Trash2 class="w-4 h-4" />
				</Button>
			</Button>
		</div>
	</ScrollArea>
</template>
