"use client"

import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import { Gift, Trophy, Clock, CheckCircle, DollarSign, Smartphone } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function PrizesPage() {
  const { session } = useAuth()
  const { prizes, getUserGamePlays } = useGame()
  const { toast } = useToast()
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null)

  const userGamePlays = session.user ? getUserGamePlays(session.user.id) : []
  const wonGamePlays = userGamePlays.filter((gp) => gp.isWinner)
  const totalWinnings = wonGamePlays.reduce((sum, gp) => sum + (gp.winAmount || 0), 0)

  const moneyPrizes = prizes.filter((p) => p.type === "money")
  const productPrizes = prizes.filter((p) => p.type === "product")

  const handleClaimPrize = (prizeId: string) => {
    const prize = prizes.find((p) => p.id === prizeId)
    if (!prize) return

    toast({
      title: "Prêmio solicitado!",
      description: `Seu pedido para ${prize.name} foi enviado. Entraremos em contato em breve!`,
    })
    setSelectedPrize(null)
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Central de Prêmios</h1>
            <p className="text-lg text-gray-600 mb-6">Veja todos os prêmios disponíveis e resgate suas conquistas!</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <Trophy className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Vitórias</p>
                    <p className="text-2xl font-bold text-gray-900">{wonGamePlays.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Ganho</p>
                    <p className="text-2xl font-bold text-gray-900">R$ {totalWinnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Gift className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Créditos Disponíveis</p>
                    <p className="text-2xl font-bold text-gray-900">{session.user?.credits}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prizes Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos os Prêmios</TabsTrigger>
              <TabsTrigger value="money">Prêmios em Dinheiro</TabsTrigger>
              <TabsTrigger value="products">Produtos</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prizes.map((prize) => (
                  <Card key={prize.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{prize.name}</CardTitle>
                        <Badge variant={prize.type === "money" ? "default" : "secondary"}>
                          {prize.type === "money" ? "Dinheiro" : "Produto"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            {prize.type === "money" ? (
                              <DollarSign className="w-8 h-8 text-white" />
                            ) : (
                              <Smartphone className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <p className="text-2xl font-bold text-green-600">R$ {prize.value.toLocaleString()}</p>
                        </div>

                        <p className="text-sm text-gray-600 text-center">{prize.description}</p>

                        <div className="flex items-center justify-center">
                          {prize.isAvailable ? (
                            <Badge className="bg-green-100 text-green-800">Disponível</Badge>
                          ) : (
                            <Badge variant="secondary">Indisponível</Badge>
                          )}
                        </div>

                        <Button
                          className="w-full"
                          disabled={!prize.isAvailable}
                          onClick={() => setSelectedPrize(prize.id)}
                        >
                          {prize.type === "money" ? "Solicitar Saque" : "Solicitar Produto"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="money" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {moneyPrizes.map((prize) => (
                  <Card key={prize.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        {prize.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">R$ {prize.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">{prize.description}</p>
                        </div>

                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={!prize.isAvailable}
                          onClick={() => handleClaimPrize(prize.id)}
                        >
                          Solicitar via PIX
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="products" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productPrizes.map((prize) => (
                  <Card key={prize.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Gift className="w-5 h-5 text-blue-600" />
                        {prize.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                            <Smartphone className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-xl font-bold text-gray-900">{prize.name}</p>
                          <p className="text-lg font-semibold text-blue-600">R$ {prize.value.toLocaleString()}</p>
                          <p className="text-sm text-gray-600 mt-2">{prize.description}</p>
                        </div>

                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={!prize.isAvailable}
                          onClick={() => handleClaimPrize(prize.id)}
                        >
                          Solicitar Produto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Recent Wins */}
          {wonGamePlays.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Vitórias Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wonGamePlays.slice(0, 6).map((gamePlay) => (
                  <Card key={gamePlay.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">R$ {gamePlay.winAmount?.toLocaleString()}</p>
                            <p className="text-sm text-gray-500">{new Date(gamePlay.playedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Ganhou</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* How to Claim */}
          <div className="mt-16 bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Como Resgatar Seus Prêmios</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-medium mb-1">
                  {wonGamePlays.length === 0
                    ? "Primeira Vitória"
                    : wonGamePlays.length < 5
                      ? "Jogador Iniciante"
                      : wonGamePlays.length < 10
                        ? "Jogador Experiente"
                        : "Mestre dos Jogos"}
                </h3>
                <p className="text-sm text-gray-600">
                  {wonGamePlays.length === 0
                    ? "Ganhe seu primeiro jogo!"
                    : wonGamePlays.length < 5
                      ? `${5 - wonGamePlays.length} vitórias para próximo nível`
                      : wonGamePlays.length < 10
                        ? `${10 - wonGamePlays.length} vitórias para próximo nível`
                        : "Você é um verdadeiro mestre!"}
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">2. Escolha seu Prêmio</h3>
                <p className="text-green-100">Selecione entre dinheiro via PIX ou produtos incríveis</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold mb-2">3. Receba Rapidamente</h3>
                <p className="text-green-100">Processamos em até 24h e entregamos seu prêmio</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
