<template>
  <div class="column is-4">
    <div class='box'>
      <div class="content">
        <h1>Сервер {{ server.game.name }}</h1>
      </div>
      <span class="tag is-info is-light mb-2">{{ serverAddress }}</span>
      <div class="buttons">
        <button
          :class="['button is-primary', {'is-loading': pending}]"
          @click="buttonState.callback()"
          :disabled="pending"
        >
          {{ buttonState.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import { Server, ServerStatus } from '../interfaces'
import settings from '../settings'

export default defineComponent({
  props: {
    server: {
      type: Object as PropType<Server>,
      required: true
    }
  },
  data() {
    return {
      pending: false
    }
  },
  computed: {
    buttonState() {
      switch (this.server.status) {
        case ServerStatus.CREATED:
          return {
            text: 'Собрать',
            callback: (): Promise<void> => this.changeStatus('build', ServerStatus.BUILT)
          }
        case ServerStatus.BUILT:
        case ServerStatus.STOPPED:
          return {
            text: 'Запустить',
            callback: (): Promise<void> => this.changeStatus('run', ServerStatus.RUNNING)
          }
        case ServerStatus.RUNNING:
          return {
            text: 'Остановить',
            callback: (): Promise<void> => this.changeStatus('stop', ServerStatus.STOPPED)
          }
        default:
          throw 'Unhandled status'
      }
    },
    serverAddress(): string {
      return `${settings.SERVER_HOST_URL}:${this.server.port}`
    }
  },
  methods: {
    async changeStatus(action: string, expectedStatus: ServerStatus) {
      this.pending = true
      await this.$http.post(`/servers/${this.server.id}/${action}/`)
      while (this.server.status !== expectedStatus) {
        await new Promise(resolve => setTimeout(async () => {
          const { data: server } = await this.$http.get(`/servers/${this.server.id}/`)
          this.$emit('update-server', server)
          resolve(true)
        }, 100))
      }
      this.pending = false
    },
  },
})
</script>
