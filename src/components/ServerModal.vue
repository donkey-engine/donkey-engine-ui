<template>
  <div :class="['modal', { 'is-active': show }]">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Создание сервера</p>
        <button class="delete" @click="$emit('update:show', false)" />
      </header>
      <section class="modal-card-body">
        <div
          :class="[
            'control is-fullwidth',
            { 'is-danger': v$.form.game_id.$error },
          ]"
        >
          <strong>Выберите игру</strong>
          <label v-for="game in games" :key="game.id" class="is-clickable">
            <input :value="game.id" v-model="form.game_id" type="radio">
            <article class="media box">
              <figure class="media-left image is-64x64">
                <img v-if="game.icon" :src="game.icon" :alt="game.name">
              </figure>
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ game.name }}</strong>
                    <br />
                    {{ game.description }}
                  </p>
                </div>
              </div>
            </article>
          </label>
        </div>
        <p
          :class="[
            'help is-danger',
            { 'is-invisible': !v$.form.game_id.$error },
          ]"
        >
          Выберите игру
        </p>

        <div
          :class="[
            'control is-fullwidth',
            {
              'is-loading': loading,
              'is-danger': v$.form.version_id.$error,
            },
          ]"
        >
          <strong>Выберите версию</strong>
          <br />
          <label v-for="version in versions" :key="version.id" class="is-clickable">
            <input :value="version.id" v-model="form.version_id" type="radio">
            <article class="media box">
              <div class="media-content">
                <div class="content">
                  <p>
                    <strong>{{ version.version }}</strong>
                  </p>
                </div>
              </div>
            </article>
          </label>
        </div>
        <p
          :class="[
            'help is-danger',
            { 'is-invisible': !v$.form.version_id.$error },
          ]"
        >
          Выберите версию
        </p>

        <strong>Выберите моды</strong>
        <label v-for="mod in mods" :key="mod.id" class="is-clickable">
          <input type="checkbox" :value="mod.id" v-model="form.mods" />
          <article class="media box">
            <figure class="media-left image is-64x64">
              <img v-if="mod.icon" :src="mod.icon" :alt="mod.mod.name">
            </figure>
            <div class="media-content">
              <div class="content">
                <p>
                  <strong>{{ mod.mod.name }} {{ mod.name }}</strong>
                  <br />
                  {{ mod.mod.description }}
                </p>
              </div>
            </div>
          </article>
        </label>

        <div class="is-flex is-justify-content-flex-end">
          <button
            :class="['button is-success', { 'is-loading': pending }]"
            @click="createServer"
          >
            Создать
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useVuelidate } from "@vuelidate/core"
import { required } from "@vuelidate/validators"

export default defineComponent({
  setup() {
    return { v$: useVuelidate() }
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      games: [],
      versions: [],
      mods: [],
      loading: false,
      pending: false,
      form: {
        game_id: null,
        version_id: null,
        mods: [],
      },
    }
  },
  validations() {
    return {
      form: {
        game_id: { required },
        version_id: { required },
      },
    }
  },
  async created() {
    const response = await this.$http.get("/games/")
    this.games = response.data
  },
  watch: {
    async "form.game_id"(val) {
      if (val) {
        this.loading = true
        const response = await this.$http.get(`/games/${val}/versions/`)
        this.versions = response.data
        this.loading = false
      } else {
        this.versions = []
        this.mods = []
      }
    },
    async "form.version_id"(val) {
      if (val) {
        this.loading = true
        const response = await this.$http.get(
          `/games/${this.form.game_id}/versions/${val}/mods/`
        )
        this.mods = response.data
        this.loading = false
      } else {
        this.mods = []
      }
    },
  },
  methods: {
    async createServer() {
      this.v$.$touch()
      if (this.v$.$error) return
      this.pending = true
      const { data } = await this.$http.post("/servers/", this.form)
      await this.$http.post(`/servers/${data.id}/build/`)
      this.pending = false
      this.$emit("create-server", data)
      this.$emit("update:show", false)
    },
  },
})
</script>

<style scoped>
input {
  -webkit-appearance: none;
  -moz-appearance: none;
  -ms-appearance: none;
  -o-appearance: none;
  appearance: none;
}

:checked + article.media {
  background-color: hsl(171, 100%, 41%);
}
</style>
