<template>
    <div class="container vh-100 d-flex justify-content-center align-items-center">
        <div class="card p-4" style="width: 500px">
            <h2 class="mb-4 text-center fw-bolder">Login</h2>

            <form @submit.prevent="onHandleLogin">
                <BaseInput v-model="state.form.email" label="Email" type="text" placeholder="Enter your email"
                    :error="errors.email" @blur="validateEmail" />
                <div class="mt-3">
                    <BaseInput v-model="state.form.password" label="Password" type="password"
                        placeholder="Enter your password" :error="errors.password" @blur="validatePass" />
                </div>

                <BaseButton :disabled="state.isLoading" type="submit" class="w-100 mt-3" :isLoading="state.isLoading">
                    Login
                </BaseButton>
            </form>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRequiredValidator } from "@/composables/useRequiredValidator";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const state = reactive({
    form: {
        email: "",
        password: "",
    },
    isLoading: false,
});

const { errors, validateField } = useRequiredValidator();

const validateEmail = () =>
    validateField("email", state.form.email, "Email is required");

const validatePass = () =>
    validateField("password", state.form.password, "Password cannot be empty");

const validateForm = () => {
    let isValid = true;

    const vEmail = validateEmail();
    const vPassword = validatePass();

    if (!vEmail || !vPassword) isValid = false;

    return isValid;
};

const onHandleLogin = async () => {
    if (!validateForm()) return;

    try {
        state.isLoading = true;
        await authStore.login({
            email: state.form.email,
            password: state.form.password,
        });
        router.push({ name: "dashboard" });
    } catch (err) {
        console.error(err);
    } finally {
        state.isLoading = false;
    }
};
</script>
