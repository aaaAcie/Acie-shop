import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import 'amfe-flexible'
import '@/styles/base.css'

import Vant from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)
app.use(store)
app.use(router)
app.use(Vant)
app.mount('#app')
