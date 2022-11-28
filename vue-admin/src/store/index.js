import { createStore } from 'vuex'
import app from "./modules/app" 
import infoList from "./modules/infoList" 
import createPersistedstate from 'vuex-persistedstate'
import category from "./modules/category" 
import user from './modules/user'

export default createStore({
  modules: {
    app,
    infoList,
    category,
    user,
  },
  plugins: [
    createPersistedstate({
       key: 'vue-admin',
       //下面写数据需要持久化的模块名
       paths: ['app','infoList.category_info',
        'category', 'user'
      ]
     })
   ]
})
