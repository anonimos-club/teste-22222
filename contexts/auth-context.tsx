"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User, UserSession } from "@/lib/types"
import { LocalStorage, DB_KEYS } from "@/lib/storage"

interface AuthContextType {
  session: UserSession
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, phone?: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserSession>({
    user: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Load user session on mount
    const currentUser = LocalStorage.get<User>(DB_KEYS.CURRENT_USER)
    if (currentUser) {
      setSession({
        user: currentUser,
        isAuthenticated: true,
      })
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = LocalStorage.get<User[]>(DB_KEYS.USERS) || []
    const user = users.find((u) => u.email === email)

    if (user) {
      // Update last login
      user.lastLogin = new Date()
      const updatedUsers = users.map((u) => (u.id === user.id ? user : u))
      LocalStorage.set(DB_KEYS.USERS, updatedUsers)
      LocalStorage.set(DB_KEYS.CURRENT_USER, user)

      setSession({
        user,
        isAuthenticated: true,
      })
      return true
    }

    return false
  }

  const register = async (email: string, password: string, name: string, phone?: string): Promise<boolean> => {
    const users = LocalStorage.get<User[]>(DB_KEYS.USERS) || []

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return false
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      phone,
      credits: 100, // Welcome bonus
      totalWins: 0,
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    const updatedUsers = [...users, newUser]
    LocalStorage.set(DB_KEYS.USERS, updatedUsers)
    LocalStorage.set(DB_KEYS.CURRENT_USER, newUser)

    setSession({
      user: newUser,
      isAuthenticated: true,
    })

    return true
  }

  const logout = () => {
    LocalStorage.remove(DB_KEYS.CURRENT_USER)
    setSession({
      user: null,
      isAuthenticated: false,
    })
  }

  const updateUser = (updates: Partial<User>) => {
    if (!session.user) return

    const updatedUser = { ...session.user, ...updates }
    const users = LocalStorage.get<User[]>(DB_KEYS.USERS) || []
    const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))

    LocalStorage.set(DB_KEYS.USERS, updatedUsers)
    LocalStorage.set(DB_KEYS.CURRENT_USER, updatedUser)

    setSession({
      user: updatedUser,
      isAuthenticated: true,
    })
  }

  return (
    <AuthContext.Provider value={{ session, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
