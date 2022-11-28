import { Login } from "@/api/login" 
import { removeToken, removeUsername } from "../../utils/app" 
export default {
  namespaced: true,
  state: () => {
    return {
      isCollapse: true,
      openMenuIndex: '',
      token:'',
      username:''
    }
  },
  
  mutations: {
    // 菜单折叠/菜单展开
    SET_COLLAPSE: (state) => {
      // 状态取反
      state.isCollapse = !state.isCollapse;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
      console.log('设置token成功');
      
    },
    SET_USERNAME(state, payload) {
      state.username = payload;
    },
    REMOVE_TOKEN(state) {
      state.token = ''
    },
    REMOVE_USERNAME(state) {
      state.username = ''
    },
    changeMenuIndex(state, payload) {
      state.openMenuIndex = payload
    }
  },
  actions: {
    setMenuStatus: (ctx, payload) => {
      ctx.commit("SET_COLLAPSE")
    },
    login:(ctx, payload) => { 
      return new Promise((resolve,reject) => {
        Login().then(res =>{
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    },
    logout:(ctx, payload) => {
      return new Promise((resolve,reject) => {
        removeToken()
        removeUsername();
        resolve()

      })
      
    }

  }
}