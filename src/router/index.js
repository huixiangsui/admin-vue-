import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
//用户管理组件
import UserList from '@/components/user-list/user-list.vue'
//角色管理组件
import RoleList from '@/components/role-list/role-list.vue'
import {getUserInfo} from '@/assets/js/auth'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList,
       },
       {
        name: 'role-list',
        path: '/roles',
        component: RoleList,
       }
     ]
    }
  ]
})
router.beforeEach((to, from, next) => {
// 1.添加一个全局路由导航守卫
// 2.拿到当前请求的视图路径标识
// 如果是登录组件，则直接放行通过
// 如果是非登录组件，则检查token令牌
  if (to.name === 'login') {
    next()
  } else {
    const token = getUserInfo ()
    // 检查是否具有当前登录的用户信息
    if (!token) { // 无令牌
      next({
        name: 'login'
      })
    } else {
      next()
    }
  }
})
export default router
