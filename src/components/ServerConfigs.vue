<template>
  <div class="field" v-for="(field, key) in rules" :key="key">
    <label class="label">{{ field.name }}</label>
    <div v-if="field.type == 'text' && field.config.choices" class="control">
      <div class="select">
        <select :name="key" v-model="config[key]">
          <option
            v-for="choice in field.config.choices"
            :key="choice"
            :value="choice"
          >
            {{ choice }}
          </option>
        </select>
      </div>
    </div>
    <div v-else-if="field.type == 'text'" class="control">
      <input
        class="input"
        type="text"
        v-model="config[key]"
        :name="key"
        :required="field.config.required"
      />
    </div>
    <div v-else-if="field.type == 'number'" class="control">
      <input
        class="input"
        type="number"
        v-model="config[key]"
        :name="key"
        :required="field.config.required"
        :max="field.config.max_value"
        :min="field.config.min_value"
      />
    </div>
    <div v-else-if="field.type == 'boolean'" class="control">
      <input
        type="checkbox"
        v-model="config[key]"
        :name="key"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GameConfig, ServerConfig } from '../interfaces'

interface DataType {
  rules: GameConfig
  config: ServerConfig
}

export default defineComponent({
  emits: ['updatedconfig'],
  props: {
    gameID: Number,
  },
  data(): DataType {
    return {
      rules: {},
      config: {},
    }
  },
  watch: {
    config: {
      handler(){
        this.$emit('updatedconfig', this.config)
      },
      deep: true
    },
  },
  async created() {
    const { data } = await this.$http.get(`/games/${this.gameID}/config`);
    this.rules = data;

    for (const [key, field] of Object.entries(this.rules)) {
      this.config[key] = field.config.default
    }
  },
})
</script>
