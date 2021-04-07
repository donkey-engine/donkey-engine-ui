import 'buefy/dist/buefy.css'
import Buefy from 'buefy'
import { createApp, h, use } from 'vue'
import Dashboard from './components/Dashboard.vue'
import Profile from './components/Profile.vue'
import NotFound from './components/NotFound.vue'

const routes = {
  '/dashboard': Dashboard,
  '/profile': Profile,
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

createApp(SimpleRouter).mount('#app')
use(Buefy)
