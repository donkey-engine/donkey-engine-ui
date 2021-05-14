<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <img src="/logo.jpeg" width="28" height="28">
      </a>

      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div id="navbarBasicExample" class="navbar-menu">
      <div class="navbar-start">
        <a href="/dashboard" class="navbar-item">
          Dashboard
        </a>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            {{ username }}
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item" @click="push('/profile')">
              Profile
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item" @click="signOut">
              Sign Out
            </a>
          </div>
        </div>

        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link">
            More
          </a>

          <div class="navbar-dropdown">
            <a class="navbar-item">
              About
            </a>
            <a class="navbar-item">
              Jobs
            </a>
            <a class="navbar-item">
              Contact
            </a>
            <hr class="navbar-divider">
            <a class="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
      </div>

      <div class="navbar-end">
        <div class="navbar-item">
          <div class="buttons">
            <a href="#" class="button is-primary">
              <strong>Create server</strong>
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import store from '../store'

export default defineComponent({
  inject: ['push'],
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
      this.push('/login')
    },
  }
})
</script>
