<template>
  <section class="section">
    <div class="container box">
      <h1 class="title has-text-centered">Создать аккаунт в Donkey Engine</h1>
      <div>
        <a
          class="button is-dark is-fullwidth"
          href="/api/auth/discord/"
        >
          <i class="fab fa-discord fa-lg pr-2" />
          Зарегистрироваться с помощью Discord
        </a>
      </div>

      <div class="already-registered">
        <span class="already-registered-label has-background-white is-relative pl-2 pr-2">
          Вы уже зарегистрированы?
          <router-link :to="{ path: '/login' }">
            Войдите в свой аккаунт!
          </router-link>
        </span>
      </div>

      <section v-show="showModal" class="hero">
        <div class="hero-body">
          <p class="title">
            Вы успешно зарегистрированы
          </p>
          <p class="subtitle">
            На ваш почтовый ящик отправлено сообщение.<br>
            Пожалуйста, перейдите по ссылке в этом сообщении для активации вашего профиля.<br>
          </p>
          <p class="subtitle">
            Не пришло письмо?<a @click.prevent="resendEmailConfirmation"> Отправить ещё раз</a>
          </p>
          <div>
          </div>
          <div>
          </div>
        </div>
      </section>

      <form v-show="showForm" @submit.prevent="submitForm">

        <div v-show="showError" class="notification is-danger is-light">
          {{ errorText }}
        </div>


        <div class="field">
          <label class="label">Имя пользователя</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="username" class="input" type="text" placeholder="По нему вы будете входить на сайт" required="required">
            <span class="icon is-small is-left">
              <i class="fas fa-user"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <label class="label">Электронная почта</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="email" class="input" type="email" placeholder="напр. e@mail.com" required="required">
            <span class="icon is-small is-left">
              <i class="fas fa-at"></i>
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

        <div class="field">
          <label class="label">Подтверждение пароля</label>
          <div class="control has-icons-left has-icons-right">
            <input v-model="confirmPassword" class="input" type="password" placeholder="********" required="required">
            <span class="icon is-small is-left">
              <i class="fas fa-key"></i>
            </span>
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
  methods: {
    submitForm() {
      this.showError = false
      this.errorText = ''

      if (this.password !== this.confirmPassword) {
        this.showError = true
        this.errorText = 'Пароль и подтверждение не совпадают'
        return false
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
    resendEmailConfirmation() {
      this.$http.get('/resend_email_confirmation/', {
        params: {
          username: this.username,
        }
      })
    }
  },
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
