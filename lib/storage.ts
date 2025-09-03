// Local storage utilities for data persistence
export class LocalStorage {
  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error)
      return null
    }
  }

  static set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error)
    }
  }

  static remove(key: string): void {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  }

  static clear(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  }
}

// Database keys
export const DB_KEYS = {
  USERS: "raspou_users",
  GAMES: "raspou_games",
  PRIZES: "raspou_prizes",
  GAME_PLAYS: "raspou_game_plays",
  CURRENT_USER: "raspou_current_user",
} as const
