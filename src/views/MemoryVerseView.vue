<script setup lang="ts">
import Attempt from '@/components/memoryVerseView/Attempt.vue'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'
import BibleVerseSelector, { type VerseSelection } from '@/components/BibleVerseSelector.vue'

const PAGES = ['select-verse', 'attempt'] as const
const page = ref<(typeof PAGES)[number]>('select-verse')

function startMemorizing() {
	page.value = 'attempt'
}

const verseSelection = ref<VerseSelection>({})
</script>

<template>
	<div class="container mx-auto py-8 px-4 flex flex-col justify-center h-full">
		<transition name="slide-fade" mode="out-in">
			<div v-if="page === 'select-verse'" class="max-w-3xl mx-auto text-center space-y-6 py-12 mb-[64px]">
				<h1 class="text-4xl md:text-5xl font-bold tracking-tight">Scripture Memory Challenge</h1>
				<p class="text-muted-foreground text-lg italic">"I have hidden your word in my heart that I might not sin against you." - Psalm 119:11</p>

				<div class="flex flex-col md:flex-row items-end justify-center gap-4 mt-8">
					<!-- Placeholder for verse selection - to be implemented -->
					<BibleVerseSelector v-model="verseSelection" />
					<Button @click="startMemorizing" class="w-full md:w-auto" size="lg">Start Memorizing</Button>
				</div>
				<div class="mt-6 text-sm text-muted-foreground">
					<p>Regular scripture memorization helps build spiritual discipline and provides comfort in times of need.</p>
				</div>
			</div>

			<Attempt v-else-if="page === 'attempt'" @choose-new-verse="page = 'select-verse'" :verse="verseSelection" />
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
