import 'buefy/dist/buefy.css'
import axios from 'axios'
import { createApp, h } from 'vue'
import Dashboard from './components/Dashboard.vue'
import NotFound from './components/NotFound.vue'
import Profile from './components/Profile.vue'
import SignUp from './components/SignUp.vue'

const routes = {
  '/dashboard': Dashboard,
  '/profile': Profile,
  '/signup': SignUp,
}

const SimpleRouter = {
  data: () => ({
    currentRoute: window.location.pathname
  }),

  computed: {
    CurrentComponent() {
      return routes[this.currentRoute] || NotFound
    }
  },

  render() {
    return h(this.CurrentComponent)
  }
}

const app = createApp(SimpleRouter)
app.config.globalProperties.$http = axios
app.mount('#app')
