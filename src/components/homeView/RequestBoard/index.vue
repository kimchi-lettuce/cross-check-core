<script setup lang="ts">
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Carousel } from '@/components/ui/carousel'
import { Button } from '@/components/ui/button'
import AddRequestDialog from './AddRequestDialog.vue'
</script>

<template>
	<Card>
		<CardHeader class="flex flex-row align-baseline py-4">
			<div class="flex gap-3 items-baseline flex-1">
				<span class="text-2xl font-bold whitespace-nowrap">Resource Requests</span>
				<span class="text-sm text-muted-foreground">Ask the community for resource recommendations and discover shared materials</span>
			</div>
			<AddRequestDialog />
		</CardHeader>
		<CardContent>
			<Carousel
				:opts="{
					align: 'start',
					loop: true,
					skipSnaps: false,
					dragFree: true
				}"
				class="w-full overflow-x-auto"
			>
				<div class="flex gap-4 p-1 w-full">
					<Card class="min-w-[300px] max-w-[320px] flex-shrink-0" v-for="i in 5" :key="i">
						<CardHeader>
							<h3 class="font-semibold">Looking for JavaScript Learning Resources</h3>
							<p class="text-sm text-muted-foreground">Posted 2 days ago</p>
						</CardHeader>
						<CardContent>
							<p class="text-sm">
								I'm a beginner developer looking for recommended resources to learn JavaScript fundamentals. Prefer video courses or interactive platforms.
							</p>
							<div class="flex gap-2 mt-4">
								<Button size="sm" variant="secondary">Suggest Resource</Button>
								<Button size="sm" variant="outline">View Details</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</Carousel>
		</CardContent>
	</Card>
</template>
