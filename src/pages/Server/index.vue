<template>
  <section class="section">
    <div class="columns">
      <div class="column">
        <template v-if="server">
          <div class="field">
            <label class="label">Название</label>
            <server-rename-form
              class="control"
              :server="server"
              @rename="server = $event"
            />
          </div>
          <div class="field">
            <label class="label">Игра</label>
            {{ server.game.name }}
          </div>
          <div class="field">
            <label class="label">Версия</label>
            {{ server.version.version }}
          </div>
          <div class="field">
            <label class="label">Адрес</label>
            {{ serverAddress }}
          </div>
          <div class="field">
            <label class="label">Статус</label>
            <span :class="['tag', serverStatus.color]">{{ serverStatus.text }}</span>
          </div>
          <p class="subtitle">Конфигурация</p>
          <div class="field" v-for="(field, name) in server.config" :key="name">
            <label class="label">{{ name }}</label>
            {{ field }}
          </div>
          <div class="field">
            <button
              :class="['button is-danger is-outlined', { 'is-loading': deleting }]"
              @click="deleteServer()"
            >
              <span class="icon">
                <i class="fas fa-trash-alt" />
              </span>
              <span>Удалить</span>
            </button>
          </div>
        </template>
      </div>
      <div class="column">
        <ServerLogs v-if="['RUNNING', 'STOPPED'].includes(server?.status)" />
      </div>
    </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import store from '../../store'
import { Server, ServerStatus } from '../../interfaces'
import settings from '../../settings'
import ServerLogs from './ServerLogs.vue'
import ServerRenameForm from './ServerRenameForm.vue'


export default defineComponent({
  components: { ServerLogs, ServerRenameForm },
  data() {
    return {
      server: null as null | Server,
      deleting: false,
    }
  },
  computed: {
    serverAddress(): string {
      if (this.server?.status === ServerStatus.RUNNING) {
        return `${settings.SERVER_HOST_URL}:${this.server.port}`
      } else {
        return 'Сервер не запущен'
      }
    },
    serverStatus() {
      if (this.server?.status === ServerStatus.RUNNING) {
        return {
          text: 'Запущен',
          color: 'is-success',
        }
      } else {
        return {
          text: 'Остановлен',
          color: 'is-danger',
        }
      }
    },
  },
  async created() {
    try {
      const { data } = await this.$http.get(`/servers/${this.$route.params.id}/`)
      this.server = data
    } catch {
      this.$router.push('/404')
    }
  },
  methods: {
    async deleteServer() {
      this.deleting = true
      try {
        await this.$http.delete(`/servers/${this.server?.id}/`)
        store.commit({
          type: 'setServers',
          servers: store.state.servers.filter(server => server.id != this.server?.id)
        })
        this.$router.push('/dashboard')
      } finally {
        this.deleting = false
      }
    }
  }
})
</script>
