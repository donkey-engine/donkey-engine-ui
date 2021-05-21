<template>
  <section class="section">
    <h1 class="title">Создать новый аккаунт в Donkey Engine</h1>
    <p>Вы уже зарегистрированы? <a href="/login" @click.prevent="push('/login')">Войдите в свой аккаунт!</a></p>
    <div class="container is-fluid box">

      <section v-show="showModal" class="hero">
        <div class="hero-body">
          <p class="title">
            Вы успешно зарегистрированы
          </p>
          <p class="subtitle">
            Теперь вы можете <a href="/login" @click.prevent="push('/login')">войти</a> в свой аккаунт.
          </p>
        </div>
      </section>

      <form v-show="showForm" @submit.prevent="submitForm">

        <div v-show="showError" class="notification is-danger is-light">
          {{ errorText }}
        </div>


        <div class="field">
          <label class="label">Имя пользователя</label>
          <div class="control">
            <input v-model="username" class="input" type="text" placeholder="По нему вы будете входить на сайт" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Электронная почта</label>
          <div class="control">
            <input v-model="email" class="input" type="email" placeholder="напр. e@mail.com" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Пароль</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Подтверждение пароля</label>
          <div class="control">
            <input v-model="confirmPassword" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <button class="button is-primary">Создать аккаунт</button>
      </form>
    </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      showForm: true,
      showModal: false,

      showError: false,
      errorText: '',

      username: null,
      email: null,
      password: null,
      confirmPassword: null,
    }
  },
  inject: ['push'],
  methods: {
    submitForm() {
      this.showError = false
      this.errorText = ''

      if (this.password !== this.confirmPassword) {
        this.showError = true
        this.errorText = 'Пароль и подтверждение не совпадают'
      }

      this.$http.post('/signup/', {
        username: this.username,
        password: this.password,
        email: this.email,
      })
      .then(() => {
        this.showForm = false
        this.showModal = true
      })
      .catch((error) => {
        this.showError = true
        if (error.response && error.response.data) {
          for (const key of Object.keys(error.response.data)) {
            this.errorText += `${key}: ${error.response.data[key].join(';')}\n`
          }
        } else {
          this.errorText = 'Неизвестная ошибка. Попробуйте еще раз через какое-то время'
        }
      })
    },
  },
})
</script>
