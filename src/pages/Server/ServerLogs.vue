<template>
  <div class="subtitle">Билд № {{ buildId }}</div>
  <section class="has-background-dark has-text-primary-light section log-block">
    <div class="is-family-monospace">
      <ul>
        <li
          v-for="(logItem, index) in logs"
          :key="`log-${index}`"
          class="log-item"
        ><span class="has-text-info">{{ index }}</span>: {{ logItem }}</li>
      </ul>
    </div>
  </section>
  <!-- <input
    class="input is-family-monospace log-input"
    type="text"
    placeholder="/help"
  /> -->
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

import { getClient } from '../../websocket'

export default defineComponent({
  data() {
    return {
      logs: [] as String[],
      buildId: 0,
    }
  },
  async created() {
    const { data } = await this.$http.get(`/servers/${this.$route.params.id}/logs/`)
    this.logs = data.logs.trim().split('\n')
    this.buildId = data.build

    const wsClient = getClient()

    wsClient.on('LOGS', (data) => {
      if (data.data.server_id == this.$route.params.id && data.data.logs) {
        const logs: String = data.data.logs.trim()
        logs.split('\n').map(logsLine => this.logs.push(logsLine))
      }
    })
  }
})
</script>

<style scoped>
  .log-block {
    overflow-y: scroll;
    max-height: 640px;
  }

  .log-item:hover {
    background-color: hsl(0, 0%, 14%);
  }

  .log-input {
    color: #fff;
    background-color: hsl(0, 0%, 14%);
    border: 0;
    border-radius: 0;
  }
  .log-input::placeholder {
    color: hsl(0, 0%, 21%);
  }
</style>
