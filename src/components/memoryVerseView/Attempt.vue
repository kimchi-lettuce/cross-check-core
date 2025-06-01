<script setup lang="ts">
import { api } from '@/../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/components/ui/toast'
import { cn } from '@/lib/utils'
import { useAuth } from '@clerk/vue'
import { useConvexMutation, useConvexQuery } from '@convex-vue/core'
import type { Doc, Id } from 'convex/_generated/dataModel'
import { CircleCheckBig, EyeClosedIcon, EyeIcon, LoaderCircle } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'
import VueMarkdown from 'vue-markdown-render'

const { userId } = useAuth()
const { toast } = useToast()

defineProps<{ verse: Doc<'userBibleEntries'> | null }>()
defineEmits(['choose-new-verse'])

/** The id of the attempt that the user is currently working on */
const attemptId = ref<Id<'verseAttempts'> | undefined>()

const { mutate: createAttempt, error: createAttemptError } = useConvexMutation(api.memoryVerse.attempt.createAttempt)
const { data: attemptData, isLoading: isAttemptLoading } = useConvexQuery(
	api.memoryVerse.attempt.listenToAttempt,
	// Reacts to when `attemptId` changes
	computed(() => ({ attemptId: attemptId.value }))
)
/** Whether or not we are still evaluating the user's attempt */
const isEvaluating = computed(() => {
	return attemptId.value && (isAttemptLoading.value || attemptData.value?.status === 'pending')
})
// const feedbackResponse = computed(() => attemptData.value?.feedback)
// const feedbackScore = computed(() => attemptData.value?.score)
// const feedbackHasLoaded = computed(() => attemptData.value?.status === 'evaluated')
const scoreColorClass = computed(() => {
	const score = attemptData.value?.score
	if (!score) return
	if (score >= 80) return 'bg-emerald-500' // Great score
	if (score >= 60) return 'bg-amber-500' // Decent score
	return 'bg-rose-500' // Needs improvement
})

/** Whether or not to show the verse text */
const revealVerse = ref(true)
/** The user's input */
const userInput = ref('')
/** The user's input that was submitted */
const submittedUserInput = ref('')

watch(userInput, (newVal, oldVal) => {
	if (newVal === oldVal) return
	// Whenever the user types, automate hiding the verse for them
	revealVerse.value = false

	// If the user is currently viewing their submitted attempt, and they try to
	// change their input, show a toast to guide the user to press the "Next
	// Attempt" button
	if (submittedUserInput.value && submittedUserInput.value !== newVal) {
		userInput.value = submittedUserInput.value
		toast({
			title: 'Ready for Another Try?',
			description: 'Use the "Next Attempt" button to start fresh with this verse',
			duration: 5000
		})
	}
})

/** Reset the UI in preparation for a new attempt */
function resetAttempt() {
	attemptId.value = undefined
	submittedUserInput.value = ''
	userInput.value = ''
	revealVerse.value = true
}

/** Submit the user's attempt to be evaluated */
async function submitUserAttempt() {
	if (!userId.value) throw new Error('User not authenticated')
	if (userInput.value.length === 0) throw new Error('User input is required')

	submittedUserInput.value = userInput.value
	const resp = await createAttempt({
		userId: userId.value,
		// FIXME: Remove the hardcoded verse reference
		verseReference: 'John 3:16',
		// TODO: Add bible translation version
		submittedText: userInput.value
	})
	if (!resp) throw new Error(`No attempt id returned ${createAttemptError.value}`)

	console.log('Watching attemptId response', attemptId)
	attemptId.value = resp
}
</script>

<template>
	<div class="max-w-3xl mx-auto">
		<div v-if="!verse" class="text-center text-muted-foreground">
			<p>No verse selected</p>
		</div>
		<div v-else class="bg-card rounded-lg p-6">
			<div class="mb-6">
				<div class="relative">
					<div class="bg-muted p-4 rounded-md mb-4 blurred-verse" :class="{ revealed: revealVerse }">
						<p class="text-lg font-medium">{{ verse.title }}</p>
						<p class="italic">{{ verse.text }}</p>
					</div>
					<button
						@click="revealVerse = !revealVerse"
						class="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-white p-2 rounded-full transition-all active:scale-95"
					>
						<EyeIcon v-if="revealVerse" class="size-5" />
						<EyeClosedIcon v-else class="size-5" />
					</button>
				</div>
			</div>

			<div class="space-y-4">
				<div class="flex flex-col space-y-2">
					<label for="user-input" class="text-sm font-medium">Type the verse from memory:</label>
					<textarea
						id="user-input"
						v-model="userInput"
						placeholder="Try to memorize this verse..."
						rows="4"
						class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
					></textarea>
				</div>

				<div class="flex flex-row items-center">
					<transition name="slide-fade">
						<div v-if="attemptId" class="flex-1 flex gap-2 items-center">
							<Progress :modelValue="attemptData?.score" :indicatorClass="cn('transition-all duration-300 ease-out', scoreColorClass)" />
							<LoaderCircle v-if="isEvaluating" class="h-4 w-4 animate-spin" />
							<CircleCheckBig v-else class="h-4 w-4" />
						</div>
					</transition>
					<div class="flex-1 flex justify-end">
						<Button v-if="attemptData?.status === 'evaluated'" @click="resetAttempt()">Next Attempt</Button>
						<Button v-else @click="submitUserAttempt()" :disabled="isEvaluating">
							<template v-if="attemptId">
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />
								<span>Evaluating...</span>
							</template>
							<span v-else>Check Verse</span>
						</Button>
					</div>
				</div>

				<transition name="fade">
					<VueMarkdown v-if="attemptData?.feedback" :source="attemptData.feedback" />
				</transition>
			</div>
		</div>
	</div>
</template>

<style scoped>
.blurred-verse {
	filter: blur(4px);
	transition: filter 0.3s ease;
}

.blurred-verse.revealed {
	filter: blur(0);
}

/* Some classes for a vue transition called "slide-fade" */
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateY(10px);
	opacity: 0;
}
</style>
