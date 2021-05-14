<template>
  <section class="section">
    <h1 class="title">Sign in to Donkey Engine</h1>
    <p>Don't have an account yet? <a href="/signup" @click.prevent="push('/signup')">Create new Donkey Engine account!</a></p>
    <div class="container is-fluid box">
      <form @submit.prevent="submitForm">

        <div v-show="showError" class="notification is-danger is-light">
          {{ errorText }}
        </div>

        <div class="field">
          <label class="label">Username</label>
          <div class="control">
            <input v-model="username" class="input" type="text" placeholder="Type your username here" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <button class="button is-primary">Sign in</button>
      </form>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import store from '../store'

export default defineComponent({
  data() {
    return {
      username: '',
      password: '',

      showError: false,
      errorText: '',
    }
  },
  inject: ['push'],
  methods: {
    submitForm() {
      this.showError = false
      this.errorText = ''

      this.$http.post('/auth/', {username: this.username, password: this.password}).then(response => {
        store.state.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        this.push('/dashboard')
      }).catch(error => {
        this.showError = true
        if (error.response && error.response.data) {
          for (const key of Object.keys(error.response.data)) {
            this.errorText += `${key}: ${error.response.data[key].join(';')}\n`
          }
        } else {
          this.errorText = 'Unknown error. Please try again later.'
        }
      })
    }
  }
})
</script>
