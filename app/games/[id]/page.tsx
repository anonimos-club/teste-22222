"use client"

import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { ScratchCard } from "@/components/scratch-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Coins, Trophy } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const { session, updateUser } = useAuth()
  const { games, playGame } = useGame()
  const { toast } = useToast()
  const [isPlaying, setIsPlaying] = useState(false)
  const [gameResult, setGameResult] = useState<{ isWinner: boolean; prize?: any; winAmount?: number } | null>(null)

  const gameId = params.id as string
  const game = games.find((g) => g.id === gameId)

  if (!game) {
    return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Jogo não encontrado</h1>
            <Button asChild>
              <Link href="/games">Voltar aos Jogos</Link>
            </Button>
          </div>
        </div>
      </AuthGuard>
    )
  }

  const handlePlayGame = async () => {
    if (!session.user || session.user.credits < game.cost) {
      toast({
        title: "Créditos insuficientes",
        description: "Você não tem créditos suficientes para jogar.",
        variant: "destructive",
      })
      return
    }

    setIsPlaying(true)

    try {
      // Deduct credits first
      const updatedCredits = session.user.credits - game.cost
      updateUser({ credits: updatedCredits })

      // Play the game
      const result = await playGame(gameId, session.user.id)
      setGameResult(result)

      if (result.isWinner && result.winAmount) {
        // Add winnings to credits
        const finalCredits = updatedCredits + result.winAmount
        updateUser({
          credits: finalCredits,
          totalWins: session.user.totalWins + 1,
        })

        toast({
          title: "Parabéns! Você ganhou!",
          description: `Você ganhou R$ ${result.winAmount}! Seus créditos foram atualizados.`,
        })
      } else {
        toast({
          title: "Que pena!",
          description: "Não foi dessa vez, mas continue tentando!",
        })
      }
    } catch (error) {
      toast({
        title: "Erro no jogo",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const resetGame = () => {
    setIsPlaying(false)
    setGameResult(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Jogos
              </Link>
            </Button>
          </div>

          {/* Game Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{game.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{game.description}</p>

            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span>
                  Seus créditos: <strong>{session.user?.credits}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-500" />
                <span>
                  Custo: <strong>{game.cost} créditos</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Game Area */}
          <div className="flex justify-center mb-8">
            <Card className="w-full max-w-2xl">
              <CardContent className="p-8">
                {!isPlaying ? (
                  <div className="text-center">
                    <div className="mb-6">
                      <Badge className="bg-yellow-500 text-black font-bold text-lg px-4 py-2">
                        Prêmio Máximo: R$ {game.maxPrize.toLocaleString()}
                      </Badge>
                    </div>

                    <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-12 text-white mb-6">
                      <div className="text-6xl mb-4">🎰</div>
                      <h3 className="text-2xl font-bold mb-2">Pronto para jogar?</h3>
                      <p className="text-green-100">Clique no botão abaixo para começar!</p>
                    </div>

                    <Button
                      size="lg"
                      onClick={handlePlayGame}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 text-lg"
                      disabled={!session.user || session.user.credits < game.cost}
                    >
                      Jogar por {game.cost} créditos
                    </Button>
                  </div>
                ) : (
                  <ScratchCard
                    game={game}
                    result={gameResult}
                    onComplete={() => {
                      // Game completed, show result
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Game Result */}
          {gameResult && (
            <div className="text-center mb-8">
              <Card className="max-w-md mx-auto">
                <CardContent className="p-6">
                  {gameResult.isWinner ? (
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Parabéns!</h3>
                      <p className="text-lg mb-4">
                        Você ganhou <strong>R$ {gameResult.winAmount?.toLocaleString()}</strong>!
                      </p>
                      {gameResult.prize && (
                        <p className="text-sm text-gray-600 mb-4">Prêmio: {gameResult.prize.name}</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-4">😔</div>
                      <h3 className="text-2xl font-bold text-gray-600 mb-2">Que pena!</h3>
                      <p className="text-lg mb-4">Não foi dessa vez, mas continue tentando!</p>
                    </div>
                  )}

                  <Button onClick={resetGame} className="w-full mt-4">
                    Jogar Novamente
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
