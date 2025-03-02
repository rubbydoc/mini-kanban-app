<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
            <h1 class="text-2xl font-bold text-center text-gray-700">Login</h1>
            <form @submit.prevent="login" class="space-y-6">
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">Email:</label>
                    <input type="email" v-model="email" required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <p v-if="errors.email" class="text-sm text-red-500">{{ errors.email }}</p>
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                    <input type="password" v-model="password" required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
                </div>
                <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Login</button>
                <p v-if="errors.general" class="text-sm text-center text-red-500">{{ errors.general }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
    data() {
        return {
            email: '',
            password: '',
            errors: {}
        };
    },
    methods: {
        async login() {
            this.errors = {};
            if (!this.email) {
                this.errors.email = 'Email is required.';
            } else if (!this.validEmail(this.email)) {
                this.errors.email = 'Email is not valid.';
            }
            if (!this.password) {
                this.errors.password = 'Password is required.';
            }
            if (Object.keys(this.errors).length === 0) {
                try {
                    const authStore = useAuthStore();
                    await authStore.login(this.email, this.password);
                    console.log('Login successful');
                    this.$router.push('/home');
                    // Handle successful login here
                } catch (error) {
                    if (error.response && error.response.data) {
                        this.errors.general = error.response.data.message || 'Invalid email or password.';
                    } else {
                        this.errors.general = 'An error occurred. Please try again.';
                    }
                }
            }
        },
        validEmail(email) {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
            return re.test(email);
        }
    }
};
</script>

<style scoped>
/* No additional styles needed as Tailwind CSS handles the styling */
</style>
