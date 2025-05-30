<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// import your Convex mutation hook here
// import { useMutation } from 'convex/vue'
// import { api } from '../../convex/_generated/api'

const open = ref(false)
const title = ref('')
const translation = ref('')
const text = ref('')

// const createEntry = useMutation(api.userBibleEntries.create)

const handleSubmit = async () => {
	// await createEntry({ title: title.value, translation: translation.value, text: text.value })

	// Optionally reset fields and close dialog
	title.value = ''
	translation.value = ''
	text.value = ''
	open.value = false
}
</script>

<template>
	<Dialog v-model:open="open">
		<DialogTrigger as-child>
			<Button variant="outline" class="w-full">New Verse</Button>
		</DialogTrigger>
		<DialogContent>
			<DialogTitle>Add a New Bible Verse</DialogTitle>
			<DialogDescription>Enter the verse details below.</DialogDescription>
			<form @submit.prevent="handleSubmit" class="space-y-4 mt-4">
				<div class="flex gap-2">
					<div class="flex-1">
						<label class="block text-sm font-medium mb-1">Title</label>
						<Input v-model="title" type="text" class="w-full" placeholder="e.g. John 3:16-20" required />
					</div>
					<div class="w-20">
						<label class="block text-sm font-medium mb-1">Translation</label>
						<Input v-model="translation" type="text" maxlength="4" class="w-full text-center" placeholder="ESV" required />
					</div>
				</div>
				<div>
					<label class="block text-sm font-medium mb-1">Verse Content</label>
					<textarea
						class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full h-32"
						v-model="text"
						placeholder="Paste the verse here"
						required
					/>
				</div>
				<DialogFooter>
					<Button type="submit" class="w-full">Save</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
