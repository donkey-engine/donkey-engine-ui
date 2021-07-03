import store from './store'

export interface WebSocketInterface {
  /** Is client initialized */
  initialized: boolean
  /** WebSocket connection */
  connection?: WebSocket
  /** Initialize WebSocket connection */
  init(): void
}

class Client implements WebSocketInterface {
  public initialized: boolean = false
  public connection?: WebSocket

  public init() {
    if (this.initialized) {
      throw Error('Already initialized')
    }
    if (!store.state.user) {
      throw Error('There is no user')
    }
    this.connection = new WebSocket(this.buildURL())
    this.initialized = true

    this.connection.onmessage = (event) => {
      this.onmessage(event)
    }

    this.connection.onopen = (_event) => {
      setInterval(() => this.ping(), 10000)
    }
  }

  private buildURL(): string {
    const location = window.location
    const protocol = location.protocol == 'https' ? 'wss' : 'ws'
    const host = location.host
    const websocketURI = 'ws'
    const websocketRoom = '5f68876222754fabbf6bb609de89a8ba' // TODO
    return `${protocol}://${host}/${websocketURI}/${websocketRoom}`
  }

  private async onmessage(event: MessageEvent) {
    console.log(event)
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
