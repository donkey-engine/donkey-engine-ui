<template>
  <section class="hero is-large has-background-danger-light has-text-centered">
  <div class="hero-body">
      <h1 class="title">
        404
      </h1>
      <h2 class="subtitle">
        Ой... Похоже, такой страницы не существует.
      </h2>
      <p class='has-text-danger'>
        <i :class="['fas fa-3x', currentIcon]"></i>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data() {
    return {
      icons: [
        'fa-frown',
        'fa-sad-tear',
        'fa-frown-open',
        'fa-sad-cry',
      ],
      iconIndex: 0,
    }
  },
  computed: {
    currentIcon(): String {
      return this.icons[this.iconIndex]
    }
  },
  created() {
    setInterval(() => {
      this.iconIndex += 1
      this.iconIndex = this.iconIndex >= this.icons.length ? 0 : this.iconIndex
    }, 3000)
  }
})
</script>
