"use client"

import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import Link from "next/link"
import { Coins, Trophy } from "lucide-react"

export default function GamesPage() {
  const { session } = useAuth()
  const { games } = useGame()

  return (
    <AuthGuard>
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-200 mb-4">Escolha Seu Jogo</h1>
            <p className="text-lg text-slate-400 mb-6">
              Raspe e ganhe prêmios incríveis! Você tem{" "}
              <span className="font-bold text-green-400">{session.user?.credits} créditos</span>
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                <span>Créditos disponíveis: {session.user?.credits}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Total de vitórias: {session.user?.totalWins}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Card
                key={game.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-slate-600 border-slate-500"
              >
                <CardContent className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                  <p className="text-2xl font-bold text-yellow-400 mb-2">
                    Prêmios até: R$ {game.maxPrize.toLocaleString("pt-BR")},00
                  </p>
                  <p className="text-lg text-green-400 mb-6">✓ Apenas R$ {game.cost * 5},00 a rodada</p>

                  <div className="mt-6">
                    {session.user && session.user.credits >= game.cost ? (
                      <Button
                        size="lg"
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg"
                        asChild
                      >
                        <Link href={`/games/${game.id}`}>JOGAR AGORA →</Link>
                      </Button>
                    ) : (
                      <Button size="lg" className="w-full bg-slate-700 text-slate-400" variant="outline" disabled>
                        Créditos Insuficientes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
