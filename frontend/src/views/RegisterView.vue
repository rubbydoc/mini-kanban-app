<template>
    <div class="flex items-center justify-center w-screen h-screen bg-gradient-to-r from-blue-500 to-purple-600">
        <div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            <h1 class="text-3xl font-bold text-center text-gray-800">Register</h1>
            <form @submit.prevent="register" class="space-y-6">
                <div>
                    <label for="name" class="block text-sm font-medium text-gray-700">Name:</label>
                    <input type="text" v-model="name" required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <p v-if="errors.name" class="text-sm text-red-500">{{ errors.name }}</p>
                </div>
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
                <div>
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password:</label>
                    <input type="password" v-model="password_confirmation" required class="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <p v-if="errors.password_confirmation" class="text-sm text-red-500">{{ errors.password_confirmation }}</p>
                </div>
                <button type="submit" class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md cursor-pointer hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300">Register</button>
                <p v-if="errors.general" class="text-sm text-center text-red-500">{{ errors.general }}</p>
            </form>
            <p class="text-center text-gray-600">Already have an account? <router-link to="/login" class="text-blue-500 hover:underline">Login</router-link></p>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {}
    };
  },
  methods: {
    async register() {
      this.errors = {};
      if (!this.name) {
        this.errors.name = 'Name is required.';
      }
      if (!this.email) {
        this.errors.email = 'Email is required.';
      } else if (!this.validEmail(this.email)) {
        this.errors.email = 'Email is not valid.';
      }
      if (!this.password) {
        this.errors.password = 'Password is required.';
      }
      if (this.password !== this.password_confirmation) {
        this.errors.password_confirmation = 'Passwords do not match.';
      }
      if (Object.keys(this.errors).length === 0) {
        try {
          const authStore = useAuthStore();
          console.log('Registering user:', this.name, this.email, this.password);
          await authStore.register(this.name, this.email, this.password, this.password_confirmation);
          console.log('Registration successful');
          this.$router.push('/login');
          // Handle successful registration here
        } catch (error) {
          if (error.response && error.response.data) {
            if (error.response.data.errors) {
              this.errors = error.response.data.errors;
            } else {
              this.errors.general = error.response.data.message || 'Registration failed.';
            }
          } else {
            this.errors.general = 'The provided credentials are invalid.';
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
