"use client"

import { Header } from "@/components/header"
import { AuthModal } from "@/components/auth-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useGame } from "@/contexts/game-context"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import {
  Play,
  Gift,
  Trophy,
  Users,
  LayoutDashboard,
  TrendingDown,
  ArrowRight,
  Shield,
  Zap,
  Phone,
  X,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { session } = useAuth()
  const { games } = useGame()
  const router = useRouter()
  const [currentBanner, setCurrentBanner] = useState(0)
  const [currentWinner, setCurrentWinner] = useState(0)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")
  const [congratsPopupOpen, setCongratsPopupOpen] = useState(false)

  const handleOpenAuthModal = (mode: "login" | "register") => {
    setAuthModalMode(mode)
    setAuthModalOpen(true)
  }

  useEffect(() => {
    console.log("[v0] Main page loaded, checking auth status:", session.isAuthenticated)

    if (session.isAuthenticated) {
      console.log("[v0] User is authenticated, redirecting to deposit page")
      router.replace("/deposit")
    }
  }, [session.isAuthenticated, router])

  useEffect(() => {
    if (!session.isAuthenticated) {
      setCongratsPopupOpen(true)
    }
  }, [session.isAuthenticated])

  useEffect(() => {
    if (!session.isAuthenticated && !congratsPopupOpen) {
      const timer = setTimeout(() => {
        handleOpenAuthModal("register")
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [session.isAuthenticated, congratsPopupOpen])

  const handleCongratsClose = () => {
    setCongratsPopupOpen(false)
  }

  const handleCongratsResgatar = () => {
    setCongratsPopupOpen(false)
    handleOpenAuthModal("register")
  }

  const banners = [
    {
      id: 1,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner1-raspeaqui-te3xgBHvbbqzqqDcVqEJGnBR5r4Pup.png",
      alt: "Raspe e ganhe prêmios - A sorte está do seu lado",
    },
    {
      id: 2,
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/banner2-raspeaqui-raumGWLxxjL6hzL1MiAICMAytfZcza.png",
      alt: "Ache 3 iguais e ganhe na hora - Prêmios de até R$15.000",
    },
  ]

  const recentWinners = [
    { name: "Carlos Silva", prize: "R$ 2.000", game: "Raspa Sorte", time: "1 min atrás" },
    { name: "Ana Santos", prize: "iPhone 15", game: "Raspa da Alegria", time: "3 min atrás" },
    { name: "João Costa", prize: "R$ 200", game: "Raspa Sorte", time: "5 min atrás" },
    { name: "Maria Oliveira", prize: "AirPods Pro", game: "Raspa da Emoção", time: "7 min atrás" },
    { name: "Pedro Lima", prize: "R$ 1.500", game: "Raspa Sorte", time: "10 min atrás" },
    { name: "Fernanda Alves", prize: "R$ 800", game: "Raspa Sorte", time: "12 min atrás" },
    { name: "Roberto Pereira", prize: "AirPods Pro", game: "Raspa da Emoção", time: "15 min atrás" },
    { name: "Juliana Rodrigues", prize: "Honda Biz 2025", game: "Raspa da Alegria", time: "18 min atrás" },
    { name: "Lucas Martins", prize: "iPhone 15 PRO", game: "Raspa da Alegria", time: "20 min atrás" },
    { name: "Camila Ferreira", prize: "R$ 50", game: "Raspa Sorte", time: "22 min atrás" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWinner((prev) => (prev + 1) % recentWinners.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [recentWinners.length])

  return (
    <>
      <Script
        src="https://cdn.xtracky.com/scripts/interceptor.js"
        data-token="075774c6-bd2c-45b2-9d91-11ad6faf7766"
        data-click-id-param="click_id"
        strategy="afterInteractive"
      />

      <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Header onOpenAuthModal={handleOpenAuthModal} />

        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authModalMode} />

        {congratsPopupOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black border border-gray-700 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-green-500/50">
              <button
                onClick={handleCongratsClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                  <Gift className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-white text-xl font-bold mb-4">🎉 Parabéns! Você ganhou</h2>

                <div className="mb-4">
                  <div className="text-4xl font-extrabold text-green-400 mb-1">DEPÓSITO</div>
                  <div className="text-4xl font-extrabold text-yellow-400">EM DOBRO! 🤑</div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed">
                  Você pode sacar diretamente ou jogar para multiplicar seus ganhos ainda mais!
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCongratsResgatar}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg rounded-lg"
                >
                  🎁 Resgatar Agora 🎁
                </Button>

                <Button
                  onClick={handleCongratsClose}
                  variant="outline"
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600 font-medium py-3 rounded-lg"
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        <section className="relative">
          <div className="relative h-[200px] sm:h-[280px] md:h-[350px] lg:h-[400px] overflow-hidden bg-slate-800">
            <Image
              src={banners[currentBanner].image || "/placeholder.svg"}
              alt={banners[currentBanner].alt}
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </section>

        <section className="py-8 sm:py-10 md:py-12 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="w-12 h-12 flex-shrink-0">
                  <path d="M7 8h10v6c0 2.76-2.24 5-5 5s-5-2.24-5-5V8z" fill="#22c55e" />
                  <path d="M5 10h2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2z" fill="#22c55e" />
                  <path d="M17 10h2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2z" fill="#22c55e" />
                  <rect x="10" y="19" width="4" height="2" fill="#22c55e" />
                  <rect x="8" y="21" width="8" height="2" rx="1" fill="#22c55e" />
                </svg>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mt-2">Últimos Ganhadores</h2>
              </div>
              <div className="text-left">
                <p className="text-slate-400 text-sm mb-1">Total Distribuído</p>
                <p className="text-2xl font-bold text-green-400">R$ 2.753.021</p>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 sm:p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{recentWinners[currentWinner].name}</h3>

                <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-2">
                  {recentWinners[currentWinner].prize}
                </div>

                <p className="text-slate-300 mb-1">
                  Ganhou no jogo:{" "}
                  <span className="font-semibold text-green-400">{recentWinners[currentWinner].game}</span>
                </p>

                <p className="text-slate-400 text-sm">{recentWinners[currentWinner].time}</p>
              </div>
            </div>

            <div className="text-center mt-8">
              {!session.isAuthenticated ? (
                <div className="flex flex-col gap-3 sm:gap-4 justify-center px-4">
                  <Button
                    size="lg"
                    onClick={() => handleOpenAuthModal("register")}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto"
                  >
                    Cadastre-se e ganhe DEPOSITO EM DOBRO
                  </Button>
                </div>
              ) : (
                <div className="text-center px-4">
                  <p className="text-slate-200 mb-4 text-sm sm:text-base">
                    Olá, <span className="font-bold">{session.user?.name}</span>! Você tem{" "}
                    <span className="font-bold text-yellow-300">{session.user?.credits} créditos</span>
                  </p>
                  <div className="flex flex-col gap-3 sm:gap-4 justify-center">
                    <Button
                      size="lg"
                      asChild
                      className="bg-slate-600 hover:bg-slate-500 text-slate-200 font-bold w-full sm:w-auto"
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Meu Dashboard
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="bg-white hover:bg-gray-100 text-slate-600 font-bold w-full sm:w-auto"
                    >
                      <Link href="/games">
                        <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        Jogar Agora
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 md:py-12 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-2">R$ 2.5M+</h3>
                <p className="text-slate-400 text-sm sm:text-base">Em prêmios distribuídos</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-2">50K+</h3>
                <p className="text-slate-400 text-sm sm:text-base">Jogadores ativos</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-600 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-200 mb-2">1000+</h3>
                <p className="text-slate-400 text-sm sm:text-base">Prêmios entregues hoje</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 md:py-12 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-200 mb-3 sm:mb-4">Nossos Jogos</h2>
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
                Escolha entre nossos jogos de raspadinha e comece a ganhar prêmios incríveis!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {games.map((game) => {
                const gameImages = {
                  "raspa-emocao":
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RaspaDaEmocao-K2lHQlXldvmirmx2FuQ9o3rbC3Odyy.png",
                  "raspa-sorte":
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RaspaSorte-tN1JeCtfzROvX6no0TKomJfchPkkJr.png",
                  "raspa-alegria":
                    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/RaspadaAlegria-OSGPgJcTRcUaMhTWfsMoGJmTOCilGt.png",
                }

                return (
                  <Card key={game.id} className="overflow-hidden border-0 bg-slate-800">
                    <CardContent className="p-0">
                      {game.name === "Raspa Sorte" && (
                        <div className="w-full h-40 relative overflow-hidden bg-slate-800">
                          <Image
                            src="/raspa-da-sorte-banner.png"
                            alt="Raspa da Sorte - Prêmios em dinheiro"
                            fill
                            className="object-contain object-center"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      {game.name === "Raspa da Emoção" && (
                        <div className="w-full h-40 relative overflow-hidden bg-slate-800">
                          <Image
                            src="/raspa-da-emocao-banner.png"
                            alt="Raspa da Emoção - Prêmios eletrônicos"
                            fill
                            className="object-contain object-center"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      {game.name === "Raspa da Alegria" && (
                        <div className="w-full h-40 relative overflow-hidden bg-slate-800">
                          <Image
                            src="/raspa-da-alegria-banner.png"
                            alt="Raspa da Alegria - Motos e eletrônicos"
                            fill
                            className="object-contain object-center"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">{game.name}</h3>

                        <div className="mb-4">
                          <p className="text-yellow-400 font-bold text-lg">
                            Prêmios até: R$ {game.maxPrize.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-green-400">
                            <TrendingDown className="h-4 w-4" />
                            <span className="font-medium">
                              Apenas R$ {(game.cost * 1).toFixed(2).replace(".", ",")} a rodada
                            </span>
                          </div>
                        </div>

                        <Button
                          size="lg"
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base"
                          onClick={() => {
                            if (session.isAuthenticated) {
                              window.location.href = `/games/${game.id}`
                            } else {
                              handleOpenAuthModal("register")
                            }
                          }}
                        >
                          JOGAR AGORA
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10 md:py-12 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-slate-800 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Segurança Garantida</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Todas as transações são protegidas com criptografia de ponta a ponta.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Depósito Instantâneo</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Os créditos são adicionados imediatamente após confirmação do PIX.
                </p>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Suporte 24/7</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Nosso suporte está disponível 24 horas por dia para ajudar.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full h-px bg-slate-600"></div>

        <footer className="bg-slate-800 text-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <Image
                    src="/raspou-premios-logo.png"
                    alt="Raspou Prêmios"
                    width={32}
                    height={32}
                    className="w-8 h-8 object-contain"
                  />
                  Raspou Prêmios
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  A Raspou Prêmios é um Título de Capitalização de Pagamento Único, modalidade Filantropia Premiável,
                  emitido pela Kovr Capitalização S.A. – KOVRCAP (CNPJ nº 93.202.448/0001-79).
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Aprovado pela SUSEP através do processo indicado na cautela, nos termos da Lei Federal nº 14.332/2022
                  e das Circulares SUSEP nº 656/2022 e 676/2022.
                </p>
              </div>

              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="text-xl">🔗</span>
                  Links Rápidos
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Meu Perfil
                    </Link>
                  </li>
                  <li>
                    <Link href="/history" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Histórico
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-green-400 font-bold text-lg mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Suporte
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link href="/how-to-play" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Como Jogar
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Termos de Uso
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                      Política de Privacidade
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-700 pt-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-slate-500 text-xs">
                  © 2025 Raspou Prêmios - Kovr Capitalização S.A. – KOVRCAP CNPJ n.º 93.202.448/0001-79
                </p>
                <p className="text-slate-500 text-xs">Todos os direitos reservados.</p>
                <p className="text-slate-500 text-xs">
                  Jogue com responsabilidade. Proibida a venda para menores de 18 anos.
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <span className="text-slate-400 text-sm">Pagamentos Digitais por:</span>
                  <div className="flex items-center gap-2">
                    <Image
                      src="/pix-logo-new.png"
                      alt="PIX - powered by Banco Central"
                      width={120}
                      height={40}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
