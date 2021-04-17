<template>
  <Navbar />
  <section class="section">
    <h1 class="title">Dashboard</h1>
      <div class="columns is-multiline is-variable is-1">

      <ServerItem />
      <ServerItem />
      <ServerItem />
      <ServerItem />
      <ServerItem />

      </div>
  </section>
  <Footer />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Footer from '../blocks/Footer.vue'
import Navbar from '../blocks/Navbar.vue'
import ServerItem from './ServerItem.vue'

export default defineComponent({
  components: {
    Footer,
    Navbar,
    ServerItem,
  },
})
</script>
