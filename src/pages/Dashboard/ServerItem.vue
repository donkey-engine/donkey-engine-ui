 <template>
  <div class="column is-4">
    <div class='box'>
      <div class="content">
        <div class="columns">
          <div class="column is-three-quarters">
            <router-link
              :to="{ name: 'server', params: { id: server.id } }"
              class="title has-text-link"
            >
              #{{ server.id }} {{ server.name }}
            </router-link>
          </div>
          <div class="column">
            <span style="width: 100%" :class="['tag', serverStatus.color]">{{ serverStatus.text }}</span>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Игра</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>{{ server.game.name }}</p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Версия</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>{{ server.version.version }}</p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-small">
            <label class="label">Плагины</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="content">
                <dl>
                  <li v-for="mod in server.mods" :key="mod.id">{{ mod.mod.name }} v{{ mod.name }}</li>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="field is-horizontal">
        <div class="field-label is-small">
          <label class="label">Адрес</label>
        </div>
        <div class="field-body">
          <div class="field">
            <p class="control is-small">
              <input class="input is-small" type="text" v-model="serverAddress" readonly>
            </p>
          </div>
        </div>
      </div>
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

import { Server, ServerStatus } from '../../interfaces'
import settings from '../../settings'

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
    serverStatus() {
      if (this.server.status === ServerStatus.RUNNING) {
        return {
          text: 'Запущен',
          color: 'is-success'
        }
      } else {
        return {
          text: 'Остановлен',
          color: 'is-danger',
        }
      }
    },
    serverAddress(): string {
      if (this.server.status === ServerStatus.RUNNING) {
        return `${settings.SERVER_HOST_URL}:${this.server.port}`
      } else {
        return 'Сервер не запущен'
      }
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
