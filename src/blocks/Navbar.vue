<template>
  <nav class="navbar is-transparent is-fixed-top" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <b>Donkey Engine</b>
      </a>

      <a
        role="button"
        class="navbar-burger"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="isMenuActive = !isMenuActive"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" :class="['navbar-menu', {'is-active': isMenuActive}]">
      <div class="navbar-start">
        <a href="/dashboard" class="navbar-item">
          Панель управления
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ username }}
          </a>

          <div class="navbar-dropdown is-boxed">
            <a class="navbar-item" @click="signOut">
              Выйти
            </a>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            Другое
          </a>

          <div class="navbar-dropdown is-boxed">
            <a href="mailto:support@donkey-engine.host" class="navbar-item">
              Служба поддержки
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a href="#" class="button is-primary" @click="showModal = true">
              <strong>Создать сервер</strong>
            </a>
          </div>
        </div>
      </div>
    </div>

    <server-modal
      v-model:show="showModal"
      @create-server="$emit('create-server', $event)"
    />
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ServerModal from '../components/ServerModal.vue'
import store from '../store'

export default defineComponent({
  components: { ServerModal },
  data() {
    return {
      showModal: false,
      isMenuActive: false,
    }
  },
  computed: {
    username() {
      return store.state.user?.username
    },
  },
  methods: {
    async signOut() {
      await this.$http.get('/logout/')
      localStorage.removeItem('user')
      store.state.user = undefined
      this.$router.push('/login')
    },
  },
})
</script>
