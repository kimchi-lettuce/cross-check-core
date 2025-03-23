<script setup lang="ts">
import GoogleIcon from '@/components/icons/GoogleIcon.vue'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { z } from 'zod'

const registerSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8),
		confirmPassword: z.string().min(8)
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})

const error = ref('')
const isLoading = ref(false)
const isGoogleLoading = ref(false)

/** Creates a new user account with the given email and password */
const onSubmit = async (data: z.infer<typeof registerSchema>) => {
	try {
		error.value = ''
		isLoading.value = true
		await createUserWithEmailAndPassword(auth, data.email, data.password)
	} catch (e) {
		console.error('Failed to register with email/password:', e)
		if (e instanceof Error) {
			error.value = e.message
		} else {
			error.value = 'Failed to register'
		}
	} finally {
		isLoading.value = false
	}
}

/** Signs up the user with Google */
const signUpWithGoogle = async () => {
	try {
		error.value = ''
		isGoogleLoading.value = true
		const provider = new GoogleAuthProvider()
		await signInWithPopup(auth, provider)
	} catch (e) {
		console.error('Failed to register with Google:', e)
		if (e instanceof Error) {
			error.value = e.message
		} else {
			error.value = 'Failed to register with Google'
		}
	} finally {
		isGoogleLoading.value = false
	}
}
</script>

<template>
	<!-- TODO: Add a password reset link -->
	<div class="mx-auto grid w-[350px] gap-6">
		<div class="grid gap-2 text-center">
			<h1 class="text-3xl font-bold">Create an account</h1>
			<p class="text-balance text-muted-foreground">Enter your email below to create your account</p>
		</div>
		<AutoForm :schema="registerSchema" @submit="onSubmit">
			<div class="grid gap-4 mt-6">
				<p v-if="error" class="text-red-500">{{ error }}</p>
				<Button type="submit" class="w-full" :disabled="isLoading">
					<Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
					{{ isLoading ? 'Creating account...' : 'Create account' }}
				</Button>
				<Button variant="outline" type="button" class="w-full" @click="signUpWithGoogle" :disabled="isGoogleLoading">
					<GoogleIcon />
					{{ isGoogleLoading ? 'Loading...' : 'Sign up with Google' }}
				</Button>
			</div>
		</AutoForm>
		<div class="text-center text-sm">
			Already have an account?
			<RouterLink to="/auth" class="underline">Login</RouterLink>
		</div>
	</div>
</template>
