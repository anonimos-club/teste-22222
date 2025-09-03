export interface User {
  id: string
  email: string
  name: string
  phone?: string
  credits: number
  totalWins: number
  createdAt: Date
  lastLogin: Date
}

export interface Game {
  id: string
  name: string
  type: "scratch" | "instant"
  cost: number
  maxPrize: number
  description: string
  image: string
  isActive: boolean
  createdAt: Date
}

export interface Prize {
  id: string
  name: string
  value: number
  type: "money" | "product"
  image?: string
  description: string
  isAvailable: boolean
}

export interface GamePlay {
  id: string
  userId: string
  gameId: string
  prizeId?: string
  isWinner: boolean
  playedAt: Date
  cost: number
  winAmount?: number
}

export interface UserSession {
  user: User | null
  isAuthenticated: boolean
}
