<template>
  <section class="section">
    <h1 class="title">Create new Donkey Engine account</h1>
    <div class="container is-fluid box">

      <section v-show="showModal" class="hero">
        <div class="hero-body">
          <p class="title">
            Successfuly registered
          </p>
          <p class="subtitle">
            Now you can <a href="/login">log in</a> into your account.
          </p>
        </div>
      </section>

      <form v-show="showForm" @submit.prevent="submitForm">

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
          <label class="label">Your email address</label>
          <div class="control">
            <input v-model="email" class="input" type="email" placeholder="e.g. e@mail.com" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Your password</label>
          <div class="control">
            <input v-model="password" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <div class="field">
          <label class="label">Confirm your password</label>
          <div class="control">
            <input v-model="confirmPassword" class="input" type="password" placeholder="********" required="required">
          </div>
        </div>

        <button class="button is-primary">Sign up</button>
      </form>
    </div>
  </section>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import settings from '../settings'

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
  methods: {
    submitForm() {
      this.showError = false
      this.errorText = ''

      if (this.password !== this.confirmPassword) {
        this.showError = true
        this.errorText = 'Password and confirmation are not equal'
      }

      this.$http.post(settings.API_BASE_URL + '/signup/', {
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
          this.errorText = 'Unknown error. Please try again later.'
        }
      })
    },
  },
})
</script>
