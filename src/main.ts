import axios from 'axios'
import { createApp, h, defineComponent, Component } from 'vue'

import Dashboard from './components/Dashboard.vue'
import NotFound from './components/NotFound.vue'
import Profile from './components/Profile.vue'
import SignUp from './components/SignUp.vue'
import SignIn from './components/SignIn.vue'
import settings from './settings'
import store from './store'
import { getCookie } from './utils'

import 'bulma/css/bulma.css'
import './main.css'

interface Routes {
  [key: string]: Component,
}

const routes: Routes = {
  '/dashboard': Dashboard,
  '/profile': Profile,
  '/signup': SignUp,
  '/login': SignIn,
}

const publicRoutes = ['/signup', '/login']

const SimpleRouter = defineComponent({
  data() {
    return {
      currentRoute: window.location.pathname,
    }
  },

  provide() {
    return {
      push: this.push,
    }
  },

  errorCaptured(error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        localStorage.removeItem('user')
        store.state.user = undefined
        return false
      }
    }
  },

  computed: {
    CurrentComponent(): Component {
      if (store.state.user && publicRoutes.includes(this.currentRoute)) {
        this.push('/dashboard')
      } else if (!store.state.user && !publicRoutes.includes(this.currentRoute)) {
        this.push('/login')
      }
      return routes[this.currentRoute] || NotFound
    }
  },

  created() {
    const user = localStorage.getItem('user')
    if (user) {
      store.state.user = JSON.parse(user)
    }

    window.addEventListener('popstate', this.onPopState)
  },

  beforeUnmount() {
    window.removeEventListener('popstate', this.onPopState)
  },

  render() {
    return h(this.CurrentComponent)
  },

  methods: {
    push(pathname: string) {
      window.history.pushState({}, '', pathname)
      this.currentRoute = pathname
    },

    onPopState() {
      this.currentRoute = window.location.pathname
    },
  }
})


const app = createApp(SimpleRouter)
axios.defaults.baseURL = settings.API_BASE_URL
axios.interceptors.request.use(config => {
  if (!config.method) return config
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    const token = getCookie('csrftoken')
    config.headers[config.method]['X-CSRFToken'] = token
  }
  return config
})
app.config.globalProperties.$http = axios
app.mount('#app')

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $http: typeof axios
    push: (pathname: string) => void
  }
}
