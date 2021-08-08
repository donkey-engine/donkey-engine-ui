<template>
  <section class="section">
    <div class="container box">
      <h1 class="title has-text-centered">Войти в Donkey Engine аккаунт</h1>
      <div>
        <a
          class="button is-dark is-fullwidth"
          href="/api/auth/discord/"
        >
          <i class="fab fa-discord fa-lg pr-2" />
          Войти с помощью Discord
        </a>
      </div>

      <div class="already-registered">
        <span class="already-registered-label has-background-white is-relative pl-2 pr-2">
          У вас еще нет аккаунта?
          <router-link :to="{ path: '/signup' }">
            Тогда вам сюда!
          </router-link>
        </span>
      </div>

      <form @submit.prevent="submitForm">

        <div v-show="showError" class="notification is-danger is-light">
          {{ errorText }}
        </div>
        <div v-show="showEmailConfirm" class="notification is-danger is-light">
          <p class="subtitle">
            На ваш почтовый ящик отправлено сообщение.<br>
            Пожалуйста, перейдите по ссылке в этом сообщении для активации вашего профиля.<br>
          </p>
          <p class="subtitle">
            Не пришло письмо?<a @click.prevent="resendEmailConfirmation"> Отправить ещё раз</a>
          </p>
        </div>

        <div class="field">
          <label class="label">Имя пользователя</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="username" class="input" type="text" placeholder="Введите свое имя пользователя" required="required">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Пароль</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="password" class="input" type="password" placeholder="********" required="required">
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
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
      showEmailConfirm: false,
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
          if (error.response.data.error == 'User is inactive') {
            this.showError = false
            this.showEmailConfirm = true
            return
          }
          for (const key of Object.keys(error.response.data)) {
            this.errorText += `${key}: ${error.response.data[key].join(';')}\n`
          }
        } else {
          this.errorText = 'Unknown error. Please try again later.'
        }
      })
    },
    resendEmailConfirmation() {
      this.$http.get('/resend_email_confirmation/', {
        params: {
          username: this.username,
        }
      })
    }
  }
})
</script>

<style scoped>
@media (min-width: 640px) {
  .box {
    width: 640px;
  }
}
.already-registered {
  position: relative;
  text-align: center;
  padding: 10px 0;
}
.already-registered:after {
  border: 1px solid #ddd;
  content: '';
  display: block;
  position: absolute;
  top: 50%;
  width: 100%;
  border-radius: 5px;
}
.already-registered-label {
  z-index: 1;
  display: inline-block;
  max-width: 75%;
}
</style>
