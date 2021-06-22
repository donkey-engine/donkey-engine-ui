<template>
  <div v-for="(value, key) in config" :key="key">
    <input type="text" :value="value">
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { Server } from '../interfaces'

export default defineComponent({
  props: {
    serverData: Object as () => Server,
  },
  data() {
    return {
      game: {},
      config: {},
    }
  },
  async created() {
    if (this.serverData) {
      this.config = this.serverData.config;
    }
    const { data } = await this.$http.get(`/games/${this.serverData?.game.id}/config`);
    this.game = data;
  },
})
</script>
