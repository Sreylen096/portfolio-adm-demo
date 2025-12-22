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
                    <BaseInput v-model="email" label="Email" placeholder="Enter your email" type="email"
                        :error="emailError" />
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <BaseInput v-model="password" label="Password" placeholder="Enter your password" type="password"
                        :error="passwordError" />
                </div>

                <!-- Submit using BaseButton -->
                <BaseButton type="submit" label="Login" variant="primary" :disabled="isDisabled" block
                    :loading="loading" />
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const emailError = ref("");
const passwordError = ref("");


const isDisabled = computed(() => !email.value || !password.value);

const validate = () => {
    let valid = true;

    // Reset errors
    emailError.value = "";
    passwordError.value = "";

    // Email required + basic format
    if (!email.value) {
        emailError.value = "Email is required";
        valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        emailError.value = "Email is invalid";
        valid = false;
    }

    // Password required
    if (!password.value) {
        passwordError.value = "Password is required";
        valid = false;
    } else if (password.value.length < 6) {
        passwordError.value = "Password must be at least 6 characters";
        valid = false;
    }

    return valid;
};


const handleLogin = async () => {
    if (!validate()) return;

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
