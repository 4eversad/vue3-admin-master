import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/main.less'
import '@/styles/variable.less'
import "@/router/permits" 
import {confirm} from "./utils/global" 
import ElementUI from "element-plus"

import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
app.use(ElementUI, {
  locale: zhCn,
}).use(store).use(router).mount('#app')
app.config.globalProperties.$confirm = confirm

