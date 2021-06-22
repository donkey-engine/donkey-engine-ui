<template>
  <section class="section">
    <div>
      <template v-if="server">
        <div class="field">
          <label class="label">Название</label>
          <server-rename-form
            class="control"
            :server="server"
            @rename="server = $event"
          />
        </div>
        <ServerConfigs :serverData="server" />
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
        <!-- <div class="field">
          <button class="button is-danger is-outlined">
            <span class="icon">
              <i class="fas fa-trash-alt" />
            </span>
            <span>Удалить</span>
          </button>
        </div> -->
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ServerRenameForm from './ServerRenameForm.vue'
import { Server, ServerStatus } from '../interfaces'
import ServerConfigs from './ServerConfigs.vue'
import settings from '../settings'

export default defineComponent({
  components: { ServerRenameForm, ServerConfigs },
  data() {
    return {
      server: null as null | Server,
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
    const { data } = await this.$http.get(`/servers/${this.$route.params.id}/`)
    this.server = data
  },
})
</script>
