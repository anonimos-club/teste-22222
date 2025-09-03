"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Game, Prize, GamePlay } from "@/lib/types"
import { LocalStorage, DB_KEYS } from "@/lib/storage"

interface GameContextType {
  games: Game[]
  prizes: Prize[]
  gamePlays: GamePlay[]
  initializeGames: () => void
  playGame: (gameId: string, userId: string) => Promise<{ isWinner: boolean; prize?: Prize; winAmount?: number }>
  getUserGamePlays: (userId: string) => GamePlay[]
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([])
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [gamePlays, setGamePlays] = useState<GamePlay[]>([])

  useEffect(() => {
    // Load data on mount
    const storedGames = LocalStorage.get<Game[]>(DB_KEYS.GAMES) || []
    const storedPrizes = LocalStorage.get<Prize[]>(DB_KEYS.PRIZES) || []
    const storedGamePlays = LocalStorage.get<GamePlay[]>(DB_KEYS.GAME_PLAYS) || []

    setGames(storedGames)
    setPrizes(storedPrizes)
    setGamePlays(storedGamePlays)

    // Initialize default data if empty
    if (storedGames.length === 0) {
      initializeGames()
    }
  }, [])

  const initializeGames = () => {
    const defaultGames: Game[] = [
      {
        id: "1",
        name: "Raspa Sorte",
        type: "scratch",
        cost: 5,
        maxPrize: 15000,
        description: "Ache 3 iguais e ganhe na hora!",
        image: "/scratch-card-game.png",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Raspa da Emoção",
        type: "scratch",
        cost: 10,
        maxPrize: 50000,
        description: "Grandes prêmios te esperam!",
        image: "/lottery-scratch-card.png",
        isActive: true,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "Raspa da Alegria",
        type: "scratch",
        cost: 3,
        maxPrize: 5000,
        description: "Diversão garantida com prêmios incríveis!",
        image: "/colorful-scratch-game.png",
        isActive: true,
        createdAt: new Date(),
      },
    ]

    const defaultPrizes: Prize[] = [
      {
        id: "1",
        name: "iPhone 15 Pro",
        value: 8000,
        type: "product",
        description: "iPhone 15 Pro 256GB",
        isAvailable: true,
      },
      {
        id: "2",
        name: "Apple Watch",
        value: 3000,
        type: "product",
        description: "Apple Watch Series 9",
        isAvailable: true,
      },
      { id: "3", name: "Moto Honda", value: 15000, type: "product", description: "Honda CG 160", isAvailable: true },
      { id: "4", name: "R$ 100", value: 100, type: "money", description: "Dinheiro via PIX", isAvailable: true },
      { id: "5", name: "R$ 500", value: 500, type: "money", description: "Dinheiro via PIX", isAvailable: true },
      { id: "6", name: "R$ 1.000", value: 1000, type: "money", description: "Dinheiro via PIX", isAvailable: true },
    ]

    setGames(defaultGames)
    setPrizes(defaultPrizes)
    LocalStorage.set(DB_KEYS.GAMES, defaultGames)
    LocalStorage.set(DB_KEYS.PRIZES, defaultPrizes)
  }

  const playGame = async (
    gameId: string,
    userId: string,
  ): Promise<{ isWinner: boolean; prize?: Prize; winAmount?: number }> => {
    const game = games.find((g) => g.id === gameId)
    if (!game) throw new Error("Game not found")

    // Simple win logic (20% chance to win)
    const isWinner = Math.random() < 0.2
    let prize: Prize | undefined
    let winAmount: number | undefined

    if (isWinner) {
      // Select random prize
      const availablePrizes = prizes.filter((p) => p.isAvailable && p.value <= game.maxPrize)
      if (availablePrizes.length > 0) {
        prize = availablePrizes[Math.floor(Math.random() * availablePrizes.length)]
        winAmount = prize.value
      }
    }

    const gamePlay: GamePlay = {
      id: crypto.randomUUID(),
      userId,
      gameId,
      prizeId: prize?.id,
      isWinner,
      playedAt: new Date(),
      cost: game.cost,
      winAmount,
    }

    const updatedGamePlays = [...gamePlays, gamePlay]
    setGamePlays(updatedGamePlays)
    LocalStorage.set(DB_KEYS.GAME_PLAYS, updatedGamePlays)

    return { isWinner, prize, winAmount }
  }

  const getUserGamePlays = (userId: string): GamePlay[] => {
    return gamePlays.filter((gp) => gp.userId === userId)
  }

  return (
    <GameContext.Provider
      value={{
        games,
        prizes,
        gamePlays,
        initializeGames,
        playGame,
        getUserGamePlays,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
