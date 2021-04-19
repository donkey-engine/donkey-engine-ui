import 'buefy/dist/buefy.css'
import axios from 'axios'
import { createApp, h, defineComponent, Component } from 'vue'
import Dashboard from './components/Dashboard.vue'
import NotFound from './components/NotFound.vue'
import Profile from './components/Profile.vue'
import SignUp from './components/SignUp.vue'

interface Routes {
  [key: string]: Component,
}

const routes: Routes = {
  '/dashboard': Dashboard,
  '/profile': Profile,
  '/signup': SignUp,
}

const SimpleRouter = defineComponent({
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent(): Component {
      return routes[this.currentRoute] || NotFound
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
})


const app = createApp(SimpleRouter)
app.config.globalProperties.$http = axios
app.mount('#app')

declare module "@vue/runtime-core" {
  export interface ComponentCustomProperties {
    $http: typeof axios;
  }
}
