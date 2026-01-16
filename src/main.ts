import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Import KaTeX CSS
import 'katex/dist/katex.min.css';

// Import Quill CSS
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)

app.use(router)

app.mount('#app')
