<template>
  <navbar @create-server="servers.push($event)" />
  <section class="section">
    <h1 class="title">Панель управления</h1>
      <div class="columns is-multiline is-variable is-1">
        <server-item
          v-for="(server, index) in servers"
          :key="server.id"
          :server="server"
          @update-server="servers.splice(index, 1, $event)"
        />
      </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import Navbar from '../blocks/Navbar.vue'
import ServerItem from './ServerItem.vue'

export default defineComponent({
  components: {
    Navbar,
    ServerItem,
  },
  data() {
    return {
      servers: [],
    }
  },
  async created() {
    const response = await this.$http.get('/servers/')
    this.servers = response.data
  },
})
</script>
