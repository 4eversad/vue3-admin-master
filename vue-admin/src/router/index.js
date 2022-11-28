import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
const Login = () => import('../views/Login/')
const ConsoleLayout = () => import('../views/Layout/index')
const consoleIndex = () => import('../views/Console/index')
const routes = [
  {
    path: '/',
    // 首页重定向
    hidden: true,
    redirect: 'login',
    meta: {
      name: '主页'
    }
  },
  {
    path: '/login',
    hidden: true,
    component: Login,
    meta: {
      name: '登录'
    }
  },
  // --------------------控制台路由-----------------------
  {
    path: '/console',
    component: ConsoleLayout,
    redirect: 'index',
    meta: {
      name:'控制台',
      classname: 'iconfont icon-panel'
    },

    children:[
       {
      path: '/index',
      component: consoleIndex,
      meta: {
        name: '首页'
      }
    },
  ]
  },
  // ------------------信息管理路由-------------------------

  {
    path: '/info',
    component: ConsoleLayout,
    meta: {
      name:'信息管理',
      classname: 'iconfont icon-icon_xinxiguanli-copy'
    },

    children:[
       {
      path: '/infoIndex',
      component: () => import('@/views/Info/index'),
      meta: {
        name: '信息列表'
      }
    },
       {
      path: '/infoCategory',
      component: () => import('@/views/Info/Category.vue'),
      meta: {
        name: '信息分类'
      }
    },
       {
      path: '/infoDetail',
      component: () => import('@/views/Info/detail.vue'),
      hidden: true,
      meta: {
        name: '信息详情',
      }
    },
  ]
  },
  // ------------------用户管理路由-------------------------

  {
    path: '/user',
    component: ConsoleLayout,
    meta: {
      name:'用户管理',
      classname: 'iconfont icon-yonghuguanli'

    },

    children:[
       {
      path: '/userInfo',
      component: () => import('@/views/User/index'),
      meta: {
        name: '用户列表'
      }
    },
  ]
  },
  
  // ------------------信息管理路由-------------------------
 {
  path: '/personalCenter',
  component: () => import('@/views/PersonalCenter/index.vue'),
  meta: {
    name: '个人中心',
    classname: 'iconfont icon-user'
  }

 }


]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
