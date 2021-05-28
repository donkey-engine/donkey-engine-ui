<template>
  <section class="section">
    <h1 class="title">Войти в Donkey Engine аккаунт</h1>
    <p>У вас еще нет аккаунта? <router-link :to="{ path: '/signup' }">Тогда вам сюда!</router-link></p>
    <div class="container is-fluid box">
      <form @submit.prevent="submitForm">

        <div v-show="showError" class="notification is-danger is-light">
          {{ errorText }}
        </div>

        <div class="field">
          <label class="label">Имя пользователя</label>
          <div class="control">
            <input v-model="username" class="input" type="text" placeholder="Введите свое имя пользователя" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Пароль</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <button class="button is-primary">Войти</button>
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
  methods: {
    submitForm() {
      this.showError = false
      this.errorText = ''

      this.$http.post('/auth/', {username: this.username, password: this.password}).then(response => {
        store.state.user = response.data
        localStorage.setItem('user', JSON.stringify(response.data))
        this.$router.push('/dashboard')
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
