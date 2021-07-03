<template>
  <section class="section">
    <h1 class="title">Панель управления</h1>
      <div v-if="servers.length > 0" class="columns is-multiline is-variable is-1">
        <server-item
          v-for="(server, index) in servers"
          :key="server.id"
          :server="server"
          @update-server="servers.splice(index, 1, $event)"
        />
      </div>
      <div v-else class="content is-large">У вас еще нет серверов. Нажмите на кнопку "Создать сервер" в меню сверху</div>
    <div class="notification">
      Если вы нашли какую-то ошибку на сайте или у вас есть предложение по функционалу, напишите пожалуйста нам на <a href="mailto:support@donkey-engine.host">почту</a>
    </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import store from '../../store'
import ServerItem from './ServerItem.vue'

export default defineComponent({
  components: {
    ServerItem,
  },
  computed: {
    servers() {
      return store.state.servers
    }
  },
  async created() {
    const response = await this.$http.get('/servers/')
    store.commit({
      type: 'setServers',
      servers: response.data,
    })
  },
})
</script>
