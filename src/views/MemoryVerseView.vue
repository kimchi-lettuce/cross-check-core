<script setup lang="ts">
import { useClerk } from '@clerk/vue'
import { useConvexAction } from '@convex-vue/core'
import { api } from '@/../convex/_generated/api'

const { mutate } = useConvexAction(api.verseEvaluation.evaluateVerse)

const submitVerse = async () => {
	try {
		// Mock parameters for now
		const result = await mutate({
			userId: 'mock-user-id',
			verseReference: 'John 3:16',
			submittedText: 'For God so loved the world that he gave his only Son, that whoever believes in him shall not perish but have eternal life.'
		})

		console.log('Evaluation result:', result)
	} catch (error) {
		console.error('Error evaluating verse:', error)
	}
}
</script>

<template>
	<div class="container mx-auto py-8 px-4">
		<button @click="submitVerse">Submit Verse</button>
		<div class="max-w-3xl mx-auto">
			<!-- <h1 class="text-3xl font-bold mb-6">Memory Verse Challenge</h1> -->

			<div v-if="false" class="bg-card rounded-lg shadow-lg p-6 mb-8">
				<div class="flex flex-col space-y-4">
					<div class="flex flex-col space-y-2">
						<label for="verse-reference" class="text-sm font-medium">Verse Reference</label>
						<input
							id="verse-reference"
							type="text"
							placeholder="e.g. John 3:16"
							class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						/>
					</div>

					<div class="flex flex-col space-y-2">
						<label for="verse-text" class="text-sm font-medium">Verse Text</label>
						<textarea
							id="verse-text"
							placeholder="Enter the verse you want to memorize"
							rows="4"
							class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						></textarea>
					</div>

					<button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Start Challenge</button>
				</div>
			</div>

			<div class="bg-card rounded-lg shadow-lg p-6 border-[0.5px]">
				<div class="mb-6">
					<h2 class="text-xl font-semibold mb-2">Practice Mode</h2>
					<div class="bg-muted p-4 rounded-md mb-4">
						<p class="text-lg font-medium">John 3:16</p>
						<p class="italic">For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.</p>
					</div>
				</div>

				<div class="space-y-4">
					<div class="flex flex-col space-y-2">
						<label for="user-input" class="text-sm font-medium">Type the verse from memory:</label>
						<textarea
							id="user-input"
							placeholder="Start typing..."
							rows="4"
							class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
						></textarea>
					</div>

					<div class="flex space-x-4">
						<button class="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">Check Answer</button>
						<button class="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2 rounded-md">Show Hint</button>
					</div>

					<div class="mt-4 p-4 bg-green-100 text-green-800 rounded-md hidden">
						<p class="font-medium">Great job! You've memorized this verse correctly.</p>
						<div class="mt-2 flex space-x-2">
							<button class="bg-green-600 text-white px-3 py-1 rounded-md text-sm">Next Verse</button>
							<button class="bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm">Practice Again</button>
						</div>
					</div>

					<div class="mt-4 p-4 bg-amber-100 text-amber-800 rounded-md hidden">
						<p class="font-medium">Almost there! Check for small errors.</p>
						<p class="text-sm mt-1">Highlighted words show differences from the original verse.</p>
					</div>
				</div>

				<div class="mt-8 border-t pt-4">
					<h3 class="text-lg font-medium mb-2">Progress</h3>
					<div class="w-full bg-gray-200 rounded-full h-2.5">
						<div class="bg-primary h-2.5 rounded-full" style="width: 45%"></div>
					</div>
					<p class="text-sm text-gray-600 mt-2">You've completed 9 out of 20 verses in this collection.</p>
				</div>
			</div>
		</div>
	</div>
</template>
