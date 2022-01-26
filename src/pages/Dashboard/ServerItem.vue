 <template>
  <div class="column is-4">
    <div class='box'>
      <div class="content is-relative">
        <div class="is-flex is-justify-content-space-between is-align-items-center mb-2">
          <router-link
            :to="{ name: 'server', params: { id: server.id } }"
            class="is-size-3 has-text-weight-semibold has-text-link text-truncate"
            style="line-height: 1;"
            :title="`#${server.id} ${server.name}`"
          >
            #{{ server.id }} {{ server.name }}
          </router-link>
          <span :class="['tag', serverStatus.color]">{{ serverStatus.text }}</span>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Игра</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>{{ server.game.name }}</p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label">
            <label class="label">Версия</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p>{{ server.version.version }}</p>
            </div>
          </div>
        </div>
        <div class="field is-horizontal mb-3">
          <div class="field-label">
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
        <div class="field is-horizontal">
          <div class="field-label">
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
        <figure
          class="is-hidden-desktop-only is-hidden-touch image is-64x64 is-absolute"
          style="right: 0; top: 50px; margin: 0;"
        >
          <img :src="server.game.icon">
        </figure>
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
import { getClient, EventTypes } from '../../websocket'

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
            callback: (): Promise<void> => this.changeStatus('build')
          }
        case ServerStatus.BUILT:
        case ServerStatus.STOPPED:
          return {
            text: 'Запустить',
            callback: (): Promise<void> => this.changeStatus('run')
          }
        case ServerStatus.RUNNING:
          return {
            text: 'Остановить',
            callback: (): Promise<void> => this.changeStatus('stop')
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
  created() {
    const wsClient = getClient()
    wsClient.on(EventTypes.SERVERS, (data) => {
      if (this.server.id == data.data.server_id) {
        this.pending = false
      }
    })
  },
  methods: {
    async changeStatus(action: string) {
      this.pending = true
      await this.$http.post(`/servers/${this.server.id}/${action}/`)
      // TODO https://github.com/donkey-engine/donkey-engine-ui/issues/45
    },
  },
})
</script>
