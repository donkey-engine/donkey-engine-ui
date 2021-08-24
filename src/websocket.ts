import { AxiosStatic } from 'axios'

import store from './store'

export enum EventTypes {
  LOGS = 'LOGS',
  SERVERS = 'SERVERS',
}

interface EventMessage {
  type: EventTypes,
  data: any,
}

export type CallbackFn = (data: EventMessage) => void

export interface WebSocketInterface {
  /** Is client initialized */
  initialized: boolean
  /** WebSocket connection */
  connection?: WebSocket
  /** Initialize WebSocket connection */
  init(httpClient: AxiosStatic): void
  /** Stop WebSocket connection */
  deactivate(): void
  /** Event handler */
  on(eventType: EventTypes, callback: CallbackFn): void
}

class Client implements WebSocketInterface {
  public initialized: boolean = false
  public connection?: WebSocket

  private eventHandlers: { [key: string]: CallbackFn[] } = {}

  public async init(httpClient: AxiosStatic) {
    if (this.initialized) {
      throw Error('Already initialized')
    }
    if (!store.state.user) {
      throw Error('There is no user')
    }

    const { data } = await httpClient.get('/me/')

    this.connection = new WebSocket(this.buildURL(data.websocket_room))
    this.initialized = true

    this.connection.onmessage = (event) => {
      this.onmessage(event)
    }

    this.connection.onopen = (_event) => {
      setInterval(() => this.ping(), 10000)
    }
  }

  public deactivate() {
    this.connection?.close()
    this.initialized = false
  }

  public on(eventType: EventTypes, callback: CallbackFn) {
    if (!this.eventHandlers[eventType]) {
      this.eventHandlers[eventType] = []
    }
    this.eventHandlers[eventType].push(callback)
  }

  private buildURL(websocketRoom: string): string {
    const location = window.location
    const protocol = location.protocol == 'https' ? 'wss' : 'ws'
    const host = location.host
    const websocketURI = 'ws'
    return `${protocol}://${host}/${websocketURI}/${websocketRoom}`
  }

  private async handleLogs(data: EventMessage) {
    if (this.eventHandlers['LOGS']) {
      this.eventHandlers['LOGS'].map(callback => callback(data))
    }
  }

  private async handleServers(data: EventMessage) {
    store.commit({
      type: 'setServers',
      servers: store.state.servers
            .map(server => {
              if (server.id === data.data.server_id) {
                server.status = data.data.status
              }
              return server
            })
    }) // TODO https://github.com/donkey-engine/donkey-engine-ui/issues/45

    if (this.eventHandlers['SERVERS']) {
      this.eventHandlers['SERVERS'].map(callback => callback(data))
    }
  }

  private async onmessage(event: MessageEvent) {
    const data: EventMessage = JSON.parse(event.data)
    switch (data.type) {
      case EventTypes.LOGS:
        await this.handleLogs(data)
        break
      case EventTypes.SERVERS:
        await this.handleServers(data)
        break
    }
  }

  private async ping() {
    this.connection?.send('ping')
  }
}

const DATA = {
    instance: new Client(),
}

export function getClient(): WebSocketInterface {
  return DATA.instance
}
