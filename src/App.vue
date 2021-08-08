<template>
  <navbar/>
  <div class="page-content">
    <router-view/>
  </div>
  <Footer />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import Footer from './blocks/Footer.vue'
import Navbar from './blocks/Navbar.vue'
import { getClient } from './websocket'
import store from './store'

export default defineComponent({
  components: {
    Footer,
    Navbar,
  },
  created() {
    if (store.state.user) {
      getClient().init(this.$http)
    }
  },
})
</script>
