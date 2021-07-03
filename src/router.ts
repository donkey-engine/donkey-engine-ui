import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import Dashboard from './pages/Dashboard/index.vue'
import NotFound from './pages/NotFound.vue'
import SignUp from './pages/SignUp.vue'
import SignIn from './pages/SignIn.vue'
import ServerPage from './pages/Server/index.vue'
import store from './store'


const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/signup',
    component: SignUp,
    meta: {
      requiresAuth: false,
      authRoute: true,
    },
  },
  {
    path: '/login',
    component: SignIn,
    meta: {
      requiresAuth: false,
      authRoute: true,
    },
  },
  {
    path: '/404',
    component: NotFound,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
  },
  {
    path: '/server/:id',
    name: 'server',
    component: ServerPage,
    meta: {
      requiresAuth: true,
    },
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeResolve(async to => {
  if (to.meta.requiresAuth && !store.state.user) {
    return '/login'
  }
  if (to.meta.authRoute && store.state.user) {
    return '/dashboard'
  }
})
