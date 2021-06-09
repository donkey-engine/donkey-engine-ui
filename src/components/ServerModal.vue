<template>
  <div :class="['modal', { 'is-active': show }]">
    <div class="modal-background" />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Создание сервера</p>
        <button class="delete" @click="$emit('update:show', false)" />
      </header>
      <section class="modal-card-body">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Игра</label>
          </div>
          <div class="field-body is-flex-direction-column">
            <div
              :class="[
                'select is-fullwidth',
                { 'is-danger': v$.form.game_id.$error },
              ]"
            >
              <select v-model="form.game_id">
                <option :value="null"></option>
                <option v-for="game in games" :key="game.id" :value="game.id">
                  {{ game.name }}
                </option>
              </select>
            </div>
            <p
              :class="[
                'help is-danger',
                { 'is-invisible': !v$.form.game_id.$error },
              ]"
            >
              Выберите игру
            </p>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Версия</label>
          </div>
          <div class="field-body is-flex-direction-column">
            <div
              :class="[
                'select is-fullwidth',
                {
                  'is-loading': loading,
                  'is-danger': v$.form.version_id.$error,
                },
              ]"
            >
              <select v-model="form.version_id">
                <option :value="null"></option>
                <option
                  v-for="version in versions"
                  :key="version.id"
                  :value="version.id"
                >
                  {{ version.version }}
                </option>
              </select>
            </div>
            <p
              :class="[
                'help is-danger',
                { 'is-invisible': !v$.form.version_id.$error },
              ]"
            >
              Выберите версию
            </p>
          </div>
        </div>

        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Плагины</label>
          </div>
          <div class="field-body">
            <ul>
              <li class="control" v-for="mod in mods" v-bind:key="mod.id">
                <label class="checkbox">
                  <input type="checkbox" :value="mod.id" v-model="form.mods" />
                  {{ mod.mod.name }} v{{ mod.name }}
                </label>
              </li>
            </ul>
          </div>
        </div>

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
import { defineComponent } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";

export default defineComponent({
  setup() {
    return { v$: useVuelidate() };
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
    };
  },
  validations() {
    return {
      form: {
        game_id: { required },
        version_id: { required },
      },
    };
  },
  async created() {
    const response = await this.$http.get("/games/");
    this.games = response.data;
  },
  watch: {
    async "form.game_id"(val) {
      if (val) {
        this.loading = true;
        const response = await this.$http.get(`/games/${val}/versions/`);
        this.versions = response.data;
        this.loading = false;
      } else {
        this.versions = [];
        this.mods = [];
      }
    },
    async "form.version_id"(val) {
      if (val) {
        this.loading = true;
        const response = await this.$http.get(
          `/games/${this.form.game_id}/versions/${val}/mods/`
        );
        this.mods = response.data;
        this.loading = false;
      } else {
        this.mods = [];
      }
    },
  },
  methods: {
    async createServer() {
      this.v$.$touch();
      if (this.v$.$error) return;
      this.pending = true;
      const { data } = await this.$http.post("/servers/", this.form);
      await this.$http.post(`/servers/${data.id}/build/`);
      this.pending = false;
      this.$emit("create-server", data);
      this.$emit("update:show", false);
    },
  },
});
</script>
