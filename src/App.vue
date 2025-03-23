<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/index.vue'
// import { useAuthStore } from '@/stores/authStore'

// const authStore = useAuthStore()
</script>

<template>
	<!-- <AuthenticatedLayout v-if="authStore.isAuthenticated">
		<RouterView />
	</AuthenticatedLayout> -->
	<RouterView />
</template>
