<script setup lang="ts">
import { AutoForm } from '@/components/ui/auto-form'
import { DependencyType } from '@/components/ui/auto-form/interface'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer'
import { Loader2, Plus, X } from 'lucide-vue-next'
import { ref } from 'vue'
import { z } from 'zod'

const resourceSchema = z.object({
	type: z.enum(Object.keys([]) as [string, ...string[]], {
		required_error: 'Please select a resource type',
		description: 'What kind of resource are you sharing?'
	}),
	title: z.string().min(1, 'Title is required'),
	// Author is now optional since not all resources need it
	author: z.string().min(1, 'Author is required').optional(),
	url: z.string().url('Must be a valid URL').optional(),
	// Add a description field for additional context
	description: z.string().optional()
})

const URL_REQUIRED_TYPES = [] as string[]

const AUTHOR_REQUIRED_TYPES = [] as string[]

const isLoading = ref(false)

const onSubmit = async (data: z.infer<typeof resourceSchema>) => {
	try {
		isLoading.value = true
		console.log('🥬 data', data)
		// 🚨 Warning: This will include fields that are optional despite not
		// being required by that particular resource type.

		// TODO: Implement resource sharing logic
		// await db.resourceSubmissions.add($ => ({
		// 	metadata: {
		// 		type: 'Book',
		// 		title: 'Sample Book Title',
		// 		author: 'John Doe',
		// 		url: 'https://example.com'
		// 	},
		// 	submission: {
		// 		submittedBy: authStore.uid!,
		// 		submittedAt: $.serverDate(),
		// 		congregationId: '123' as Typesaurus.Id<'clubs'>
		// 	},
		// 	status: 'pending'
		// }))
		console.log('✅')
	} finally {
		isLoading.value = false
	}
}
</script>

<template>
	<Drawer>
		<DrawerTrigger as-child>
			<Button>
				<Plus />
				Share a Resource
			</Button>
		</DrawerTrigger>
		<DrawerContent direction="right">
			<div class="mx-auto w-full max-w-sm">
				<DrawerHeader>
					<DrawerTitle>Share Resource</DrawerTitle>
					<DrawerDescription>Add a resource to share with the community</DrawerDescription>
					<DrawerClose as-child>
						<Button variant="ghost" size="icon" class="absolute right-2 top-2">
							<X class="h-4 w-4" />
							<span class="sr-only">Close</span>
						</Button>
					</DrawerClose>
				</DrawerHeader>

				<div class="px-4">
					<AutoForm
						:schema="resourceSchema"
						:dependencies="[
							{
								sourceField: 'type',
								type: DependencyType.HIDES,
								targetField: 'url',
								when: (type: string) => !URL_REQUIRED_TYPES.includes(type)
							},
							{
								sourceField: 'type',
								type: DependencyType.REQUIRES,
								targetField: 'url',
								when: (type: string) => URL_REQUIRED_TYPES.includes(type)
							},
							{
								sourceField: 'type',
								type: DependencyType.HIDES,
								targetField: 'author',
								when: (type: string) => !AUTHOR_REQUIRED_TYPES.includes(type)
							},
							{
								sourceField: 'type',
								type: DependencyType.REQUIRES,
								targetField: 'author',
								when: (type: string) => AUTHOR_REQUIRED_TYPES.includes(type)
							}
						]"
						@submit="onSubmit"
						class="grid gap-4"
					>
						<div class="mt-auto flex flex-col gap-2 p-4 px-0">
							<span class="text-sm text-muted-foreground">
								By submitting the resource, a staff of your congregation will review it and it will be published if it is appropriate
							</span>
							<div class="flex gap-2">
								<DrawerClose as-child>
									<Button variant="outline" class="flex-1">Cancel</Button>
								</DrawerClose>
								<Button class="flex-1" :disabled="isLoading" type="submit">
									<Loader2 v-if="isLoading" class="w-4 h-4 mr-2 animate-spin" />
									{{ isLoading ? 'Please wait' : 'Submit' }}
								</Button>
							</div>
						</div>
					</AutoForm>
				</div>
			</div>
		</DrawerContent>
	</Drawer>
</template>
