/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  import axios from 'axios'
  const component: DefineComponent<{}, {}, any>
  export default component
}
