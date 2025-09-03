"use client"

import { Header } from "@/components/header"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import { User, Mail, Phone, Calendar, Trophy, DollarSign, GamepadIcon } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const { session, updateUser } = useAuth()
  const { getUserGamePlays } = useGame()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: session.user?.name || "",
    phone: session.user?.phone || "",
  })

  const userGamePlays = session.user ? getUserGamePlays(session.user.id) : []
  const wonGamePlays = userGamePlays.filter((gp) => gp.isWinner)
  const totalSpent = userGamePlays.reduce((sum, gp) => sum + gp.cost, 0)
  const totalWon = wonGamePlays.reduce((sum, gp) => sum + (gp.winAmount || 0), 0)

  const handleSave = () => {
    if (!session.user) return

    updateUser({
      name: formData.name,
      phone: formData.phone,
    })

    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    })

    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: session.user?.name || "",
      phone: session.user?.phone || "",
    })
    setIsEditing(false)
  }

  if (!session.user) return null

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white font-bold">{session.user.name.charAt(0).toUpperCase()}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{session.user.name}</h1>
            <p className="text-gray-600">Membro desde {new Date(session.user.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Informações Pessoais</CardTitle>
                  {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                      <Button onClick={handleSave}>Salvar</Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <User className="w-4 h-4 text-gray-500" />
                          <span>{session.user.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{session.user.email}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                        />
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{session.user.phone || "Não informado"}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Último acesso</Label>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(session.user.lastLogin).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Game History */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Histórico de Jogos</CardTitle>
                </CardHeader>
                <CardContent>
                  {userGamePlays.length > 0 ? (
                    <div className="space-y-3">
                      {userGamePlays.slice(0, 10).map((gamePlay) => (
                        <div key={gamePlay.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${gamePlay.isWinner ? "bg-green-500" : "bg-gray-400"}`}
                            />
                            <div>
                              <p className="font-medium">{gamePlay.isWinner ? "Vitória" : "Tentativa"}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(gamePlay.playedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium ${gamePlay.isWinner ? "text-green-600" : "text-red-600"}`}>
                              {gamePlay.isWinner ? "+" : "-"}R$ {(gamePlay.winAmount || gamePlay.cost).toLocaleString()}
                            </p>
                            <Badge variant={gamePlay.isWinner ? "default" : "secondary"} className="text-xs">
                              {gamePlay.isWinner ? "Ganhou" : "Perdeu"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Você ainda não jogou nenhum jogo. Que tal começar agora?
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Créditos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{session.user.credits}</p>
                    <p className="text-sm text-gray-500">Créditos disponíveis</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    Estatísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total de jogos:</span>
                    <span className="font-medium">{userGamePlays.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vitórias:</span>
                    <span className="font-medium text-green-600">{wonGamePlays.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa de vitória:</span>
                    <span className="font-medium">
                      {userGamePlays.length > 0 ? Math.round((wonGamePlays.length / userGamePlays.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total gasto:</span>
                    <span className="font-medium text-red-600">R$ {totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total ganho:</span>
                    <span className="font-medium text-green-600">R$ {totalWon.toLocaleString()}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-bold">
                    <span>Saldo líquido:</span>
                    <span className={totalWon - totalSpent >= 0 ? "text-green-600" : "text-red-600"}>
                      R$ {(totalWon - totalSpent).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GamepadIcon className="w-5 h-5 text-blue-600" />
                    Ações Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <a href="/games">Jogar Agora</a>
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="/prizes">Ver Prêmios</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
