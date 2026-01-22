<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { Paperclip, X } from 'lucide-vue-next'

const description = ref('')
const attachedFiles = ref<File[]>([])
const fileInput = ref<HTMLInputElement>()

function handleFileSelect(event: Event) {
	const target = event.target as HTMLInputElement
	if (target.files) {
		const newFiles = Array.from(target.files)
		attachedFiles.value = [...attachedFiles.value, ...newFiles]
	}
}

function removeFile(index: number) {
	attachedFiles.value.splice(index, 1)
}

function triggerFileInput() {
	fileInput.value?.click()
}

function onSubmit() {
	if (!description.value.trim()) {
		toast({
			title: 'Description required',
			description: 'Please provide a description of your issue.',
			variant: 'destructive'
		})
		return
	}

	console.log('Support request submitted:', {
		description: description.value,
		files: attachedFiles.value
	})

	toast({
		title: 'Support request submitted!',
		description: "We'll get back to you within 24 hours."
	})

	// Reset form
	description.value = ''
	attachedFiles.value = []
}
</script>

<template>
	<div class="container mx-auto py-8 px-4">
		<Card class="max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle>Contact Support</CardTitle>
				<CardDescription>Need help? Describe your issue and attach any relevant files.</CardDescription>
			</CardHeader>
			<CardContent class="space-y-6">
				<div class="space-y-2">
					<Label for="description">Description</Label>
					<Textarea id="description" v-model="description" placeholder="Please describe your issue in detail..." class="min-h-[120px]" />
				</div>

				<div class="space-y-2">
					<Label>Attachments</Label>
					<div class="space-y-2">
						<Button type="button" variant="outline" class="w-full justify-start" @click="triggerFileInput">
							<Paperclip class="w-4 h-4 mr-2" />
							Attach Files
						</Button>
						<Input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />

						<!-- File list -->
						<div v-if="attachedFiles.length > 0" class="space-y-2">
							<div v-for="(file, index) in attachedFiles" :key="index" class="flex items-center justify-between p-2 bg-muted rounded-md">
								<span class="text-sm truncate">{{ file.name }}</span>
								<Button type="button" variant="ghost" size="sm" @click="removeFile(index)">
									<X class="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>

				<Button type="button" class="w-full" @click="onSubmit">Submit Request</Button>
			</CardContent>
		</Card>
	</div>
</template>
