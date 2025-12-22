import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.min.js'

import App from './App.vue'
import router from './router'
import BaseButton from './components/ui/base/BaseButton.vue'
import BaseInput from './components/ui/base/BaseInput.vue'
import BaseModal from './components/ui/base/BaseModal.vue'
import BaseToast from './components/ui/base/BaseToast.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component("BaseButton", BaseButton)
app.component("BaseInput", BaseInput)
app.component("BaseModal", BaseModal)
app.component("BaseToast", BaseToast)

app.mount('#app')
