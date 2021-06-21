export interface Game {
  id: number
  name: string
}

export interface GameVersion {
  id: number
  version: string
  game: Game
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
}
