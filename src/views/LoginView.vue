<template>
    <div class="login-layout d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card p-4 " style="width: 400px;">
            <h3 class="text-center mb-4">Login</h3>
            <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" v-model="email" class="form-control py-2" placeholder="Enter your email"
                        required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" v-model="password" class="form-control py-2"
                        placeholder="Enter your password" required />
                </div>

                <!-- Submit -->
                <button type="submit" class="btn btn-primary w-100">Login</button>

                <!-- Optional: Forgot password -->
                <div class="text-center mt-2">
                    <a href="#" class="text-decoration-none">Forgot password?</a>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');

const handleLogin = () => {
    console.log('Email:', email.value);
    console.log('Password:', password.value);
};
</script>

<style scoped>
.login-layout {
    background: #f8f9fa;
}

.card {
    border-radius: 0.5rem;
}
</style>
