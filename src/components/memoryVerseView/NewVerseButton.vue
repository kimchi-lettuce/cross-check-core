<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@clerk/vue'
import { useConvexMutation } from '@convex-vue/core'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
import { api } from '../../../convex/_generated/api'
import { verseEntrySchema } from '../../../convex/memoryVerse/entry'
import { useToast } from '../ui/toast'
import type { Id } from 'convex/_generated/dataModel'

const dialogVisibility = defineModel<boolean>('open', { required: false })
const { userId } = useAuth()
const { toast } = useToast()

const { mutate: addVerseEntry, error: addVerseEntryError } = useConvexMutation(api.memoryVerse.entry.addVerseEntry)
watch(addVerseEntryError, error => {
	toast({
		title: 'Uh oh! Something went wrong.',
		description: 'There was a problem with your request.\n\n' + error,
		variant: 'destructive',
		duration: 15000
	})
})

// Use the shared schema for validation on server and client
const formSchema = toTypedSchema(verseEntrySchema)
const form = useForm({ validationSchema: formSchema })

const onSubmit = form.handleSubmit(async values => {
	if (!userId.value) throw new Error('User not authenticated')
	await addVerseEntry({
		...values,
		userId: userId.value as Id<'users'>
	})
	form.resetForm()
	dialogVisibility.value = false
})
</script>

<template>
	<Dialog v-model:open="dialogVisibility">
		<DialogTrigger as-child>
			<Button variant="outline" class="w-full">New Verse</Button>
		</DialogTrigger>
		<DialogContent>
			<DialogTitle>Add a New Bible Verse</DialogTitle>
			<DialogDescription>Enter the verse details below.</DialogDescription>
			<form @submit="onSubmit" class="space-y-4">
				<div class="flex gap-4">
					<FormField v-slot="{ componentField }" name="title">
						<FormItem class="flex-1">
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input type="text" placeholder="e.g. John 3:16, or custom name like 'God's Love'" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
					<FormField v-slot="{ componentField }" name="translation">
						<FormItem class="w-24">
							<FormLabel>Translation</FormLabel>
							<FormControl>
								<Input type="text" maxlength="4" class="text-center" placeholder="ESV" v-bind="componentField" />
							</FormControl>
							<FormMessage />
						</FormItem>
					</FormField>
				</div>
				<FormField v-slot="{ componentField }" name="text">
					<FormItem>
						<FormLabel>Verse Content</FormLabel>
						<FormControl>
							<textarea
								class="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary w-full h-32"
								placeholder="Paste the verse here"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<DialogFooter>
					<Button type="submit" class="w-full">Save</Button>
				</DialogFooter>
			</form>
		</DialogContent>
	</Dialog>
</template>
