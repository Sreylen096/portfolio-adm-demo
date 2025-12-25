// src/composables/useRequiredValidator.js
import { reactive } from "vue";

export function useRequiredValidator() {
  // reactive object to store field errors
  const errors = reactive({});

  const validateField = (field, value, message) => {
    errors[field] = value ? "" : message;

    // returns true if valid
    return !errors[field];
  };

  // Validate the entire form
  const validateForm = (formData, fields) => {
    let isValid = true;

    for (const field of fields) {
      const fieldValid = validateField(field, formData[field]);
      if (!fieldValid) isValid = false;
    }

    // true if all fields valid
    return isValid;
  };

  const clearErrors = () => {
    for (const key in errors) errors[key] = "";
  };

  return { errors, validateField, validateForm, clearErrors };
}
