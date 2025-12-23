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
                <div class="mb-3">
                    <BaseInput v-model="state.form.email" @input="validateEmail" label="Email"
                        placeholder="Enter your email" type="email" :error="state.formErrors.email.message" />
                </div>
                <div class="mb-3">
                    <BaseInput v-model="state.form.password" @input="validatePassword" label="Password"
                        placeholder="Enter your password" type="password" :error="state.formErrors.password.message" />
                </div>
                <BaseButton class="w-100" :isLoading="loading" :isDisabled="isDisabled" type="submit">
                    Login
                </BaseButton>


            </form>
        </div>
    </div>
    <BaseToast v-model:show="toastVisible" :message="toastMessage" />
</template>

<script setup>
import { reactive, computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const toastVisible = ref(false);
const toastMessage = ref("");

const state = reactive({
    form: {
        email: "",
        password: "",
    },
    formErrors: {
        email: {
            message: "",
            isValid: true,
        },
        password: {
            message: "",
            isValid: true,
        },
    },
});

const isDisabled = computed(() => {
    return !state.form.email || !state.form.password;
});

/* ================= VALIDATION ================= */

const validateEmail = () => {
    const email = state.form.email;
    const error = state.formErrors.email;

    error.message = "";
    error.isValid = true;

    if (!email) {
        error.message = "Email is required";
        error.isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        error.message = "Email is invalid";
        error.isValid = false;
    }

    return error.isValid;
};

const validatePassword = () => {
    const password = state.form.password;
    const error = state.formErrors.password;

    error.message = "";
    error.isValid = true;

    if (!password) {
        error.message = "Password is required";
        error.isValid = false;
    } else if (password.length < 6) {
        error.message = "Password must be at least 6 characters";
        error.isValid = false;
    }

    return error.isValid;
};

const validateForm = () => {
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    return emailValid && passwordValid;
};

/* ================= LOGIN ================= */

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
