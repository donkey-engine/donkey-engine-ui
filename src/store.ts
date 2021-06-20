import { createStore } from 'vuex'

interface User {
    id: number,
    username: string,
}

interface Server {}

interface State {
    user?: User,
    servers: Server[],
}

export default createStore({
  state(): State {
    return {
      user: undefined,
      servers: [],
    }
  },
  mutations: {
    setUser(state: State, payload) {
      state.user = payload.user
    },
    removeUser(state: State) {
      state.user = undefined
    },
    setServers(state: State, payload) {
      state.servers = payload.servers
    }
  }
})
