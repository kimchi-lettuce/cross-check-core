<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Login from '@/components/authView/Login.vue'
import Register from '@/components/authView/Register.vue'

const route = useRoute()
const isImageLoaded = ref(false)

const isRegisterMode = computed(() => route.query.mode === 'register')
</script>

<template>
	<div class="h-screen w-full lg:grid lg:grid-cols-2">
		<div class="flex items-center justify-center py-12">
			<Transition name="fade" mode="out-in">
				<Register v-if="isRegisterMode" />
				<Login v-else />
			</Transition>
		</div>
		<div class="h-full bg-muted lg:block overflow-hidden">
			<img
				src="@/assets/book-forest.jpg"
				alt="Image"
				:class="['h-full w-full object-cover dark:brightness-[0.2] dark:grayscale', 'transition-opacity duration-200', isImageLoaded ? 'opacity-100' : 'opacity-0']"
				@load="isImageLoaded = true"
			/>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition:
		opacity 0.3s ease,
		transform 0.3s ease;
}

.fade-enter-from {
	opacity: 0;
	transform: scale(0.95);
}

.fade-enter-to {
	opacity: 1;
	transform: scale(1);
}

.fade-leave-from {
	opacity: 1;
	transform: scale(1);
}

.fade-leave-to {
	opacity: 0;
	transform: scale(1.05);
}
</style>
