<!-- <template>
    <div class="login-layout d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card p-4 " style="width: 400px;">
            <h3 class="text-center mb-4">Login</h3>
            <form @submit.prevent="handleLogin">
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" v-model="email" class="form-control py-2"
                        placeholder="Enter your email" required />
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" v-model="password" class="form-control py-2"
                        placeholder="Enter your password" required />
                </div>
                <button type="submit" class="btn btn-primary w-100">Login</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");

const handleLogin = async () => {
    await authStore.login({
        email: email.value,
        password: password.value,
    });

    await authStore.fetchUser();
    router.push({ name: "dashboard" });
};
</script>


<style scoped>
.login-layout {
    background: #f8f9fa;
}

.card {
    border-radius: 0.5rem;
}
</style> -->


<template>
    <div class="login-layout d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card p-4" style="width: 400px;">
            <h3 class="text-center mb-4">Login</h3>

            <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" v-model="email" class="form-control py-2"
                        placeholder="Enter your email" required />
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" id="password" v-model="password" class="form-control py-2"
                        placeholder="Enter your password" required />
                </div>

                <!-- Submit using BaseButton -->
                <BaseButton type="submit" label="Login" variant="primary" block :loading="loading" />
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import BaseButton from "@/components/ui/base/BaseButton.vue";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);

const handleLogin = async () => {
    try {
        loading.value = true;
        await authStore.login({ email: email.value, password: password.value });
        await authStore.fetchUser();
        router.push({ name: "dashboard" });
    } catch (err) {
        console.error("Login failed:", err);
    } finally {
        loading.value = false;
    }
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
