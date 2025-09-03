"use client"

import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import Link from "next/link"
import { Trophy, DollarSign, GamepadIcon, Gift, TrendingUp, Calendar, Star, Play, Award, Target } from "lucide-react"

export default function DashboardPage() {
  const { session } = useAuth()
  const { games, prizes, getUserGamePlays } = useGame()

  const userGamePlays = session.user ? getUserGamePlays(session.user.id) : []
  const wonGamePlays = userGamePlays.filter((gp) => gp.isWinner)
  const totalSpent = userGamePlays.reduce((sum, gp) => sum + gp.cost, 0)
  const totalWon = wonGamePlays.reduce((sum, gp) => sum + (gp.winAmount || 0), 0)
  const winRate = userGamePlays.length > 0 ? (wonGamePlays.length / userGamePlays.length) * 100 : 0

  // Recent games (last 5)
  const recentGames = userGamePlays.slice(-5).reverse()

  // Available prizes
  const availablePrizes = prizes.filter((p) => p.isAvailable).slice(0, 3)

  // User level based on total games played
  const userLevel = Math.floor(userGamePlays.length / 10) + 1
  const gamesForNextLevel = userLevel * 10 - userGamePlays.length
  const levelProgress = ((userGamePlays.length % 10) / 10) * 100

  if (!session.user) return null

  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Olá, {session.user.name}! 👋</h1>
                  <p className="text-green-100 mb-4">
                    Bem-vindo ao seu painel. Você tem {session.user.credits} créditos disponíveis!
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">Nível {userLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">{wonGamePlays.length} vitórias</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-slate-500/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-bold">{session.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Créditos</p>
                    <p className="text-2xl font-bold text-slate-200">{session.user.credits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4">
                    <Trophy className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Vitórias</p>
                    <p className="text-2xl font-bold text-slate-200">{wonGamePlays.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Taxa de Vitória</p>
                    <p className="text-2xl font-bold text-slate-200">{Math.round(winRate)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
                    <Award className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-400">Total Ganho</p>
                    <p className="text-2xl font-bold text-slate-200">R$ {totalWon.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Level Progress */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Target className="w-5 h-5 text-purple-400" />
                    Progresso do Nível
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-200">Nível {userLevel}</span>
                      <span className="text-sm text-slate-400">{gamesForNextLevel} jogos para o próximo nível</span>
                    </div>
                    <Progress value={levelProgress} className="h-3" />
                    <p className="text-sm text-slate-400">
                      Jogue mais {gamesForNextLevel} vezes para alcançar o nível {userLevel + 1}!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Games */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <GamepadIcon className="w-5 h-5 text-blue-400" />
                    Jogos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentGames.length > 0 ? (
                    <div className="space-y-3">
                      {recentGames.map((gamePlay) => {
                        const game = games.find((g) => g.id === gamePlay.gameId)
                        return (
                          <div
                            key={gamePlay.id}
                            className="flex items-center justify-between p-3 bg-slate-500 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${gamePlay.isWinner ? "bg-green-400" : "bg-slate-400"}`}
                              />
                              <div>
                                <p className="font-medium text-slate-200">{game?.name || "Jogo"}</p>
                                <p className="text-sm text-slate-400">
                                  {new Date(gamePlay.playedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${gamePlay.isWinner ? "text-green-400" : "text-red-400"}`}>
                                {gamePlay.isWinner ? "+" : "-"}R${" "}
                                {(gamePlay.winAmount || gamePlay.cost).toLocaleString()}
                              </p>
                              <Badge variant={gamePlay.isWinner ? "default" : "secondary"} className="text-xs">
                                {gamePlay.isWinner ? "Ganhou" : "Perdeu"}
                              </Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <GamepadIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-400 mb-4">Você ainda não jogou nenhum jogo</p>
                      <Button asChild>
                        <Link href="/games">Começar a Jogar</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Available Games */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Play className="w-5 h-5 text-green-400" />
                    Jogos Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {games.slice(0, 4).map((game) => (
                      <div key={game.id} className="p-4 bg-slate-500 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-slate-200">{game.name}</h3>
                          <Badge className="bg-yellow-500 text-black text-xs">
                            R$ {game.maxPrize.toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-400 mb-3">{game.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-400">{game.cost} créditos</span>
                          <Button size="sm" asChild>
                            <Link href={`/games/${game.id}`}>Jogar</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Button variant="outline" asChild>
                      <Link href="/games">Ver Todos os Jogos</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-200">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                    <Link href="/games">
                      <Play className="mr-2 h-4 w-4" />
                      Jogar Agora
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-slate-400 text-slate-200 hover:bg-slate-500"
                    asChild
                  >
                    <Link href="/prizes">
                      <Gift className="mr-2 h-4 w-4" />
                      Ver Prêmios
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-slate-400 text-slate-200 hover:bg-slate-500"
                    asChild
                  >
                    <Link href="/profile">
                      <Trophy className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Available Prizes */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Gift className="w-5 h-5 text-purple-400" />
                    Prêmios em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {availablePrizes.length > 0 ? (
                    <div className="space-y-3">
                      {availablePrizes.map((prize) => (
                        <div key={prize.id} className="p-3 bg-slate-500 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm text-slate-200">{prize.name}</h4>
                            <Badge variant={prize.type === "money" ? "default" : "secondary"} className="text-xs">
                              {prize.type === "money" ? "Dinheiro" : "Produto"}
                            </Badge>
                          </div>
                          <p className="text-lg font-bold text-green-400">R$ {prize.value.toLocaleString()}</p>
                          <p className="text-xs text-slate-400 mt-1">{prize.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4">Nenhum prêmio disponível no momento</p>
                  )}
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-slate-400 text-slate-200 hover:bg-slate-500"
                      asChild
                    >
                      <Link href="/prizes">Ver Todos os Prêmios</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Achievement */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Conquista
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Trophy className="w-8 h-8 text-yellow-400" />
                    </div>
                    <h3 className="font-medium mb-1 text-slate-200">
                      {wonGamePlays.length === 0
                        ? "Primeira Vitória"
                        : wonGamePlays.length < 5
                          ? "Jogador Iniciante"
                          : wonGamePlays.length < 10
                            ? "Jogador Experiente"
                            : "Mestre dos Jogos"}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {wonGamePlays.length === 0
                        ? "Ganhe seu primeiro jogo!"
                        : wonGamePlays.length < 5
                          ? `${5 - wonGamePlays.length} vitórias para próximo nível`
                          : wonGamePlays.length < 10
                            ? `${10 - wonGamePlays.length} vitórias para próximo nível`
                            : "Você é um verdadeiro mestre!"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Stats */}
              <Card className="bg-slate-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-200">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Jogos:</span>
                      <span className="font-medium text-slate-200">
                        {
                          userGamePlays.filter(
                            (gp) => new Date(gp.playedAt).toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Vitórias:</span>
                      <span className="font-medium text-green-400">
                        {
                          wonGamePlays.filter(
                            (gp) => new Date(gp.playedAt).toDateString() === new Date().toDateString(),
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Ganhos:</span>
                      <span className="font-medium text-green-400">
                        R${" "}
                        {wonGamePlays
                          .filter((gp) => new Date(gp.playedAt).toDateString() === new Date().toDateString())
                          .reduce((sum, gp) => sum + (gp.winAmount || 0), 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
