import { Component } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from './components/Dashboard.vue'
import SignUp from './components/SignUp.vue'
import SignIn from './components/SignIn.vue'
import store from './store'

interface Routes {
  path: string,
  component: Component,
  meta: {
    requiresAuth: boolean
    authRoute?: boolean
  }
}

const routes: Routes[] = [
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
