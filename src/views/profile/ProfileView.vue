<template>
    <div class="profile-view">
        <div class="container">
            <div class="card shadow-sm pb-3">
                <!-- Header Banner -->
                <div class="profile-header bg-gradient"></div>

                <!-- Profile Content -->
                <div class="card-body position-relative">
                    <!-- Avatar Section -->
                    <div
                        class="d-flex flex-column flex-sm-row align-items-center align-items-sm-end profile-avatar-section">
                        <div class="position-relative">
                            <img :src="currentAvatar" alt="Profile" class="profile-avatar" />
                            <button v-if="isEditing" @click="showImageCropper = true"
                                class="avatar-edit-btn btn btn-primary" title="Change avatar">
                                <i class="bi bi-camera"></i>
                            </button>
                            <button v-if="isEditing && authStore.user?.avatar" @click="handleDeleteAvatar"
                                class="avatar-delete-btn btn btn-danger" title="Delete avatar">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>

                        <div class="flex-grow-1 ms-sm-4 mt-3 mt-sm-0 text-center text-sm-start">
                            <h1 class="h2 mb-1">{{ authStore.user?.firstName }} {{ authStore.user?.lastName }}</h1>
                            <p class="text-muted mb-0">{{ authStore.user?.email }}</p>
                        </div>

                        <button v-if="!isEditing" @click="startEditing" class="btn btn-primary mt-3 mt-sm-0">
                            <i class="bi bi-pencil me-2"></i>Edit Profile
                        </button>
                    </div>

                    <!-- Profile Form -->
                    <div class="mt-5">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <BaseInput v-model="formData.firstName" label="First Name" id="firstName"
                                    placeholder="Enter first name" :disabled="!isEditing" :error="errors.firstName"
                                    required @blur="validateFirstName" />
                            </div>

                            <div class="col-md-6">
                                <BaseInput v-model="formData.lastName" label="Last Name" id="lastName"
                                    placeholder="Enter last name" :disabled="!isEditing" :error="errors.lastName"
                                    required @blur="validateLastName" />
                            </div>

                            <div class="col-12">
                                <BaseInput v-model="formData.email" label="Email Address" id="email" type="email"
                                    placeholder="Enter email address" :disabled="!isEditing" :error="errors.email"
                                    required @blur="validateEmail" />
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div v-if="isEditing" class="d-flex gap-2 mt-4">
                            <button @click="handleSave" class="btn btn-primary" :disabled="profileStore.isLoading">
                                <span v-if="profileStore.isLoading"
                                    class="spinner-border spinner-border-sm me-2"></span>
                                <i v-else class="bi bi-check-lg me-2"></i>
                                {{ profileStore.isLoading ? 'Saving...' : 'Save Changes' }}
                            </button>
                            <button @click="handleCancel" class="btn btn-outline-secondary"
                                :disabled="profileStore.isLoading">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Cropper Modal -->
        <BaseModal v-if="showImageCropper" title="Crop Profile Image" size="lg" @close="cancelCrop">
            <div class="cropper-container">
                <Cropper v-if="uploadedImage" ref="cropperRef" class="cropper" :src="uploadedImage"
                    :stencil-props="{ aspectRatio: 1 }" :stencil-component="circleStencil" />
                <div v-else class="d-flex align-items-center justify-content-center h-100 text-muted">
                    <div class="text-center">
                        <i class="bi bi-image fs-1 d-block mb-2"></i>
                        <p>Select an image to crop</p>
                    </div>
                </div>
            </div>

            <div class="mt-3">
                <label for="imageUpload" class="btn btn-outline-secondary w-100">
                    <i class="bi bi-upload me-2"></i>Choose Image
                </label>
                <input id="imageUpload" ref="fileInputRef" type="file" accept="image/*" @change="handleFileSelect"
                    class="d-none" />
            </div>

            <template #footer>
                <button @click="cancelCrop" class="btn btn-secondary" :disabled="profileStore.isLoading">
                    Cancel
                </button>
                <button @click="applyCrop" class="btn btn-primary" :disabled="!uploadedImage || profileStore.isLoading">
                    <span v-if="profileStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-check-lg me-2"></i>
                    {{ profileStore.isLoading ? 'Uploading...' : 'Apply' }}
                </button>
            </template>
        </BaseModal>

        <!-- Delete Avatar Confirmation Modal -->
        <BaseModal v-if="showDeleteAvatarModal" title="Delete Profile Picture" @close="showDeleteAvatarModal = false">
            <p class="mb-0">
                Are you sure you want to delete your profile picture? This will reset it to the default avatar.
            </p>

            <template #footer>
                <button @click="showDeleteAvatarModal = false" class="btn btn-secondary"
                    :disabled="profileStore.isLoading">
                    Cancel
                </button>
                <button @click="confirmDeleteAvatar" class="btn btn-danger" :disabled="profileStore.isLoading">
                    <span v-if="profileStore.isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-trash me-2"></i>
                    {{ profileStore.isLoading ? 'Deleting...' : 'Delete' }}
                </button>
            </template>
        </BaseModal>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Cropper, CircleStencil } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
import { useRequiredValidator } from '@/composables/useRequiredValidator';
import { useAuthStore } from '@/stores/auth';
import { useProfileStore } from '@/stores/profile';

// Stores
const authStore = useAuthStore();
const profileStore = useProfileStore();

// Default avatar URL
const defaultAvatar = 'https://ui-avatars.com/api/?name=User&size=120&background=667eea&color=fff';

// Form data
const formData = reactive({
    firstName: '',
    lastName: '',
    email: '',
});

// Validation composable
const { errors, validateField } = useRequiredValidator();

// UI state
const isEditing = ref(false);
const showImageCropper = ref(false);
const showDeleteAvatarModal = ref(false);

// Image cropper state
const uploadedImage = ref(null);
const croppedImagePreview = ref(null);
const cropperRef = ref(null);
const fileInputRef = ref(null);
const circleStencil = CircleStencil;

// Computed current avatar
const currentAvatar = computed(() => {
    if (croppedImagePreview.value) return croppedImagePreview.value;
    return authStore.user?.avatar || defaultAvatar;
});

// Initialize form data from auth store
onMounted(() => {
    if (authStore.user) {
        formData.firstName = authStore.user.firstName || '';
        formData.lastName = authStore.user.lastName || '';
        formData.email = authStore.user.email || '';
    }
});

// Validation methods
const validateFirstName = () => {
    return validateField('firstName', formData.firstName.trim(), 'First name is required');
};

const validateLastName = () => {
    return validateField('lastName', formData.lastName.trim(), 'Last name is required');
};

const validateEmail = () => {
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
        return false;
    }
    errors.email = '';
    return true;
};

// Validate all fields
const validateForm = () => {
    const isFirstNameValid = validateFirstName();
    const isLastNameValid = validateLastName();
    const isEmailValid = validateEmail();
    return isFirstNameValid && isLastNameValid && isEmailValid;
};

// Clear validation errors
const clearErrors = () => {
    errors.firstName = '';
    errors.lastName = '';
    errors.email = '';
};

// Start editing mode
const startEditing = () => {
    isEditing.value = true;
    if (authStore.user) {
        formData.firstName = authStore.user.firstName || '';
        formData.lastName = authStore.user.lastName || '';
        formData.email = authStore.user.email || '';
    }
    croppedImagePreview.value = null;
    clearErrors();
};

// Save profile changes
const handleSave = async () => {
    if (!validateForm()) {
        return;
    }

    try {
        // Update profile data
        await profileStore.updateProfile({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
        });

        // Upload avatar if cropped
        if (croppedImagePreview.value) {
            await profileStore.uploadAvatarBase64(croppedImagePreview.value);
            croppedImagePreview.value = null;
        }

        isEditing.value = false;

        // Show success message (you can use a toast library here)
        console.log('Profile updated successfully');
    } catch (error) {
        console.error('Failed to update profile:', error);
        // You can show an error toast here
    }
};

// Cancel editing
const handleCancel = () => {
    isEditing.value = false;
    if (authStore.user) {
        formData.firstName = authStore.user.firstName || '';
        formData.lastName = authStore.user.lastName || '';
        formData.email = authStore.user.email || '';
    }
    croppedImagePreview.value = null;
    clearErrors();
};

// Handle file selection for cropper
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadedImage.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    // Reset file input
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

// Apply crop
const applyCrop = async () => {
    if (cropperRef.value) {
        const { canvas } = cropperRef.value.getResult();
        if (canvas) {
            const base64Data = canvas.toDataURL('image/jpeg', 0.9);

            try {
                // Upload immediately
                await profileStore.uploadAvatarBase64(base64Data);

                showImageCropper.value = false;
                uploadedImage.value = null;
                croppedImagePreview.value = null;

                // Show success message
                console.log('Avatar updated successfully');
            } catch (error) {
                console.error('Failed to upload avatar:', error);
                // Show error message
            }
        }
    }
};

// Cancel crop
const cancelCrop = () => {
    showImageCropper.value = false;
    uploadedImage.value = null;
    if (fileInputRef.value) {
        fileInputRef.value.value = '';
    }
};

// Handle delete avatar button click
const handleDeleteAvatar = () => {
    showDeleteAvatarModal.value = true;
};

// Confirm delete avatar
const confirmDeleteAvatar = async () => {
    try {
        await profileStore.deleteAvatar();
        showDeleteAvatarModal.value = false;
        croppedImagePreview.value = null;

        // Show success message
        console.log('Avatar deleted successfully');
    } catch (error) {
        console.error('Failed to delete avatar:', error);
        // Show error message
    }
};
</script>

<style scoped>
.profile-view {
    min-height: calc(100vh - 56px);
    background-color: #f8f9fa;
    padding-top: 2rem;
}

.profile-header {
    height: 120px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.profile-avatar-section {
    margin-top: -100px;
}

.profile-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 4px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    object-fit: cover;
}

.avatar-edit-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.avatar-delete-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.cropper-container {
    height: 400px;
    background: #f8f9fa;
    border-radius: 8px;
    overflow: hidden;
}

.cropper {
    height: 100%;
    width: 100%;
}

.bg-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>