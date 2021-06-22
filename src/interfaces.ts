/** Configuration rules for game */
export interface GameConfig {
  [key: string]: {
    /** Field type */
    type: 'text' | 'number' | 'boolean'
    /** Field name. `name == key` */
    name: string
    /** Field description */
    description: string
    /** Field config rules */
    config: {
      /** Field value is required */
      required: boolean
      /** Field default value */
      default: number | string | boolean | null
      /** Field is editable (These fields are not shows) */
      editable: boolean

      /** Allowed values (Only for `type=text`) */
      choices?: string[]

      /** Min allowed value (Only for `type=number`) */
      min_value?: number | null
      /** Max allowed value (Only for `type=number`) */
      max_value?: number | null
    }
  }
}

export interface Game {
  id: number
  name: string
}

export interface GameVersion {
  id: number
  version: string
  game: Game
}

/** Current server configuration */
export interface ServerConfig {
  /** Server configuration field */
  [key: string]: string | number | boolean | null;
}

export enum ServerStatus {
  CREATED = 'CREATED',
  BUILT = 'BUILT',
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
}

export interface Server {
  id: number
  name: string
  game: Game
  version: GameVersion
  status: ServerStatus
  port: number
  config: ServerConfig
}
