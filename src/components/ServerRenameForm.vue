<template>
  <div class="is-flex">
    <input
      v-model="serverName"
      type="text"
      class="input"
      style="width: 300px"
    />
    <button
      :class="['button ml-3', {'is-loading': pending}]"
      :disabled="server.name === serverName"
      @click="changeName"
    >
      Переименовать
    </button>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'

import { Server } from '../interfaces'

export default defineComponent({
  props: {
    server: {
      type: Object as PropType<Server>,
      required: true
    }
  },
  data() {
    return {
      serverName: '',
      pending: false,
    }
  },
  watch: {
    'server.name': {
      handler() {
        this.serverName = this.server.name
      },
      immediate: true
    }
  },
  methods: {
    async changeName() {
      const { data } = await this.$http.patch(`/servers/${this.server.id}/`,
                                              { name: this.serverName })
      this.$emit('rename', data)
    },
  },
})
</script>
