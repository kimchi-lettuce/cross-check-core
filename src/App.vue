<script setup lang="ts">
import { RouterView } from 'vue-router'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout/index.vue'
import { useAuth } from '@clerk/vue'

const { isSignedIn } = useAuth()
</script>

<template>
	<!-- Show authenticated layout when signed in -->
	<AuthenticatedLayout v-if="isSignedIn">
		<RouterView />
	</AuthenticatedLayout>

	<!-- Show default layout when not signed in -->
	<template v-else>
		<RouterView />
	</template>
</template>
