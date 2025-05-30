<script setup lang="ts">
import Attempt from '@/components/memoryVerseView/Attempt.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area/index'
import { ref } from 'vue'
import type { VerseSelection } from '@/components/BibleVerseSelector.vue'
import NewVerseButton from '@/components/memoryVerseView/NewVerseButton.vue'
const PAGES = ['select-verse', 'attempt'] as const
const page = ref<(typeof PAGES)[number]>('select-verse')

// Mock data for saved verses - in a real app, this would come from an API/database
const savedVerses = [
	{ id: 1, title: 'John 3:16', text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.' },
	{ id: 2, title: 'Psalm 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
	{
		id: 3,
		title: 'Proverbs 3:5-6',
		text: 'Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.'
	},
	{ id: 4, title: 'Romans 8:28', text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.' },
	{ id: 5, title: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
	{
		id: 6,
		title: 'Isaiah 40:31',
		text: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.'
	}
]

const selectedVerseTitle = ref('')
const selectedVerseText = ref('')
const selectedVerse = ref<VerseSelection>({})

function selectVerse(verse: (typeof savedVerses)[0]) {
	selectedVerseTitle.value = verse.title
	selectedVerseText.value = verse.text
}

function startMemorizing() {
	if (!selectedVerseTitle.value || !selectedVerseText.value) {
		return // Don't proceed if no verse is selected or entered
	}

	selectedVerse.value = {
		// This is a simplified version - in a real app, you'd parse the title to get book, chapter, verse
		book: { key: 'custom', label: selectedVerseTitle.value, value: { testament: 'new', chapters: 1, title: selectedVerseTitle.value } }
	}

	page.value = 'attempt'
}
</script>

<template>
	<div class="container mx-auto py-8 px-4 flex flex-col justify-center h-full">
		<transition name="slide-fade" mode="out-in">
			<div v-if="page === 'select-verse'" class="max-w-[1400px] space-y-6 py-12 flex flex-col h-full">
				<Card class="flex-1 flex flex-col max-h-[80vh]">
					<CardHeader>
						<CardTitle>Select a Verse to Memorize</CardTitle>
						<CardDescription>Choose from your saved verses or enter a new one</CardDescription>
					</CardHeader>
					<CardContent class="flex-1 flex flex-col">
						<div class="flex-1 flex flex-col md:flex-row gap-6">
							<!-- Left sidebar with saved verses -->
							<div class="w-full md:w-1/3 border-r pr-4">
								<NewVerseButton />
								<ScrollArea class="h-[300px]">
									<div class="space-y-2">
										<Button
											v-for="verse in savedVerses"
											:key="verse.id"
											variant="ghost"
											class="w-full justify-start text-left h-auto py-2"
											@click="selectVerse(verse)"
										>
											<span class="truncate">{{ verse.title }}</span>
										</Button>
									</div>
								</ScrollArea>
							</div>

							<!-- Right side with verse editor -->
							<div class="w-full md:w-2/3">
								<div class="space-y-4">
									<div>
										<label for="verse-title" class="block text-sm font-medium mb-1">Verse Reference</label>
										<Input id="verse-title" v-model="selectedVerseTitle" placeholder="e.g., John 3:16" class="w-full" />
									</div>

									<div>
										<label for="verse-text" class="block text-sm font-medium mb-1">Verse Text</label>
										<textarea
											id="verse-text"
											v-model="selectedVerseText"
											placeholder="Enter the verse text here..."
											rows="5"
											class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
										></textarea>
									</div>
								</div>
								<Button @click="startMemorizing" :disabled="!selectedVerseTitle || !selectedVerseText" class="px-6">Start Memorizing</Button>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Attempt v-else-if="page === 'attempt'" :verse="selectedVerse" @choose-new-verse="page = 'select-verse'" />
		</transition>
	</div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
	opacity: 0;
	transform: translateY(50px);
}

.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-50px);
}
</style>
