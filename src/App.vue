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

export default defineComponent({
  components: {
    Footer,
    Navbar,
  },
})
</script>
