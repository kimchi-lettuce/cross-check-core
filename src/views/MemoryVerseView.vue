<script setup lang="ts">
import Attempt from '@/components/memoryVerseView/Attempt.vue'
import NewVerseButton from '@/components/memoryVerseView/NewVerseButton.vue'
import UserVerses from '@/components/memoryVerseView/UserVerses.vue'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Doc } from 'convex/_generated/dataModel'
import { ref } from 'vue'

const selectedVerse = ref<Doc<'userBibleEntries'> | null>(null)
</script>

<template>
	<div class="container mx-auto py-8 px-4 flex flex-col justify-center h-full">
		<Card class="flex-1 flex flex-col max-h-[80vh]">
			<CardHeader>
				<CardTitle>Memorise a Bible Verse</CardTitle>
				<!-- TODO: Fix user copy -->
				<CardDescription>Choose from your saved verses or enter a new one</CardDescription>
			</CardHeader>
			<CardContent class="flex-1 flex flex-col">
				<div class="flex-1 flex flex-col md:flex-row gap-6">
					<!-- Left sidebar with saved verses -->
					<div class="w-full md:w-1/3 border-r pr-4 space-y-4">
						<NewVerseButton />
						<UserVerses :selectedVerse="selectedVerse" @select="selectedVerse = $event" />
					</div>

					<!-- Right side with verse editor -->
					<div class="w-full md:w-2/3">
						<Attempt :verse="selectedVerse" />
					</div>
				</div>
			</CardContent>
		</Card>
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
