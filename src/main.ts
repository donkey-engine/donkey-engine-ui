import axios from 'axios'
import { createApp, h } from 'vue'

import App from './App.vue'
import settings from './settings'
import store from './store'
import { router } from './router'
import { getCookie } from './utils'

import 'bulma/css/bulma.css'
import './main.css'

async function main() {
  axios.defaults.baseURL = settings.API_BASE_URL
  try {
    const { data } = await axios.get('/me/')
    store.commit({
      type: 'setUser',
      user: data
    })
  } finally {
    const app = createApp({
      render() {
        return h(App)
      }
    })
    axios.interceptors.request.use(config => {
      if (!config.method) return config
      if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
        const token = getCookie('csrftoken')
        config.headers[config.method]['X-CSRFToken'] = token
      }
      return config
    })
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 403) {
          store.commit('removeUser')
          return Promise.reject(error)
        }
        return Promise.reject(error)
      }
    )
    app.config.globalProperties.$http = axios
    app.use(router)
    app.use(store)
    app.mount('#app')
  }
}

main()

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $http: typeof axios
    push: (pathname: string) => void
  }
}
