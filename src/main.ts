import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import type { Plugin } from "vue";
import VueApexCharts from "vue3-apexcharts";

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts as unknown as Plugin);

app.mount('#app')
