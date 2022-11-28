import router from "./index" 
import { getToken, removeToken, removeUsername } from "@/utils/app.js" 
const whiteRouter = ['/login']
router.beforeEach((to, from, next) => {
  if(getToken()) {
    if(to.path === "/login") {
      removeToken()
      removeUsername()
    }
    next()
  } else {
    // 如果要跳转的路由在白名单,那么直接不带参数next()
    // 一开始to.path为'/index',不在白名单内,所以跳转到'/index'
    // 跳到'/index'后不会一直死循环跳转, 因为想再次跳转到'/login'时, 
    // 判断to.path为'/login',在白名单内,直接next()了
    if(whiteRouter.indexOf(to.path) != -1) {
      //目标路由在白名单里
      next()
    } else {
      next('/login')
    }
    console.log('不存在');
  }
  // next()
  
})