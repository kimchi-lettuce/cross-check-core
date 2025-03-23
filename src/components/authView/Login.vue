<script setup lang="ts">
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { auth } from '@/lib/firebaseConfig'
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { z } from 'zod'

const error = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
})

/** Signs in the user with the given email and password */
const onSubmit = async (data: z.infer<typeof loginSchema>) => {
	try {
		error.value = ''
		isLoading.value = true
		await signInWithEmailAndPassword(auth, data.email, data.password)
	} catch (e) {
		console.error('Failed to login with email/password:', e)
		if (e instanceof Error) {
			error.value = e.message
		} else {
			error.value = 'Failed to login'
		}
	} finally {
		isLoading.value = false
	}
}

/** Signs in the user with Google */
const signInWithGoogle = async () => {
	try {
		error.value = ''
		isGoogleLoading.value = true
		const provider = new GoogleAuthProvider()
		await signInWithPopup(auth, provider)
	} catch (e) {
		console.error('Failed to login with Google:', e)
		if (e instanceof Error) {
			error.value = e.message
		} else {
			error.value = 'Failed to login with Google'
		}
	} finally {
		isGoogleLoading.value = false
	}
}
</script>

<template>
	<div class="mx-auto grid w-[350px] gap-6">
		<div class="grid gap-2 text-center">
			<h1 class="text-3xl font-bold">Welcome to CrossCheck</h1>
			<p class="text-balance text-muted-foreground">Enter your email below to login to your account</p>
		</div>
		<AutoForm :schema="loginSchema" @submit="onSubmit">
			<div class="grid gap-4 mt-6">
				<p v-if="error" class="text-red-500">{{ error }}</p>
				<Button type="submit" class="w-full" :disabled="isLoading">
					<Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
					{{ isLoading ? 'Logging in...' : 'Login' }}
				</Button>
				<Button variant="outline" type="button" class="w-full" @click="signInWithGoogle" :disabled="isGoogleLoading">
					<GoogleIcon />
					{{ isGoogleLoading ? 'Loading...' : 'Sign in with Google' }}
				</Button>
			</div>
		</AutoForm>
		<div class="text-center text-sm">
			Don't have an account?
			<RouterLink class="underline" to="/auth?mode=register">Sign up</RouterLink>
		</div>
	</div>
</template>
