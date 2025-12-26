<template>
    <div class="login-layout d-flex justify-content-center align-items-center vh-100 bg-light">
        <div class="card p-4" style="width: 400px;">
            <h3 class="text-center mb-4">Login</h3>

            <form @submit.prevent="handleLogin">
                <!-- Email -->
                <div class="mb-3">
                    <BaseInput v-model="state.form.email"
                        @input="validateField('email', state.form.email, 'Email is required.')" label="Email"
                        placeholder="Enter your email" type="email" :error="errors.email" />
                </div>

                <!-- Password -->
                <div class="mb-3">
                    <BaseInput v-model="state.form.password"
                        @input="validateField('password', state.form.password, 'Password is required.', { min: 6 })"
                        label="Password" placeholder="Enter your password" type="password" :error="errors.password" />
                </div>

                <!-- Submit -->
                <BaseButton class="w-100" :isLoading="loading" :isDisabled="isDisabled" type="submit">
                   {{ loading ? "Logging in..." : "Login" }}
                </BaseButton>
            </form>
        </div>

        <!-- Toast -->
        <BaseToast v-model:show="toastVisible" :message="toastMessage" />
    </div>
</template>

<script setup>
import { reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useRequiredValidator } from "@/composables/useRequiredValidator";

// Auth & Router
const authStore = useAuthStore();
const router = useRouter();

// Loading & Toast
const loading = ref(false);
const toastVisible = ref(false);
const toastMessage = ref("");

// Validation
const { errors, validateField } = useRequiredValidator();

// Form state
const state = reactive({
    form: {
        email: "",
        password: "",
    },
});

// Disable login button if fields are empty
const isDisabled = computed(() => !state.form.email || !state.form.password);

// Validate entire form
const validateForm = () => {
    const emailValid = validateField("email", state.form.email, "Email is required.");
    const passwordValid = validateField("password", state.form.password, "Password is required.", { min: 6 });
    return emailValid && passwordValid;
};

// Handle login
const handleLogin = async () => {
    if (!validateForm()) return;

    try {
        loading.value = true;

        await authStore.login({
            email: state.form.email,
            password: state.form.password,
        });

        await authStore.fetchUser();

        toastMessage.value = "Login successful!";
        toastVisible.value = true;

        router.push({ name: "dashboard" });
    } catch (err) {
        toastMessage.value = "Login failed!";
        toastVisible.value = true;
        console.error(err);
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
