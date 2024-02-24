import { type Future } from './Future'

export interface Order {
  inGameName: string
  date: string
  multiple: number
  future: Future
}
