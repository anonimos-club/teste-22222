"use client"

import type React from "react"
import Script from "next/script"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Check, Shield, Copy, Clock, CheckCircle } from "lucide-react"
import Image from "next/image"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

type PaymentStep = "form" | "processing" | "success"

export default function DepositPage() {
  const [depositAmount, setDepositAmount] = useState("30")
  const [selectedAmount, setSelectedAmount] = useState<number | null>(30)
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("form")
  const [pixCode, setPixCode] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { session, updateUser } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("[v0] Deposit page loaded, auth status:", session.isAuthenticated)

    // Only prevent navigation, don't redirect authenticated users away
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Você deve fazer um depósito antes de continuar."
      return "Você deve fazer um depósito antes de continuar."
    }

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      // Push the current state back to prevent navigation
      window.history.pushState(null, "", window.location.href)
    }

    // Add event listeners to prevent navigation
    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("popstate", handlePopState)

    // Push initial state to prevent back navigation
    window.history.pushState(null, "", window.location.href)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("popstate", handlePopState)
    }
  }, []) // Removed session.isAuthenticated and router from dependencies to prevent re-running

  // Timer for PIX payment
  useEffect(() => {
    if (paymentStep === "processing" && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [paymentStep, timeRemaining])

  const suggestedAmounts = [
    { value: 30, label: "R$ 30" },
    { value: 50, label: "R$ 50" },
    { value: 70, label: "R$ 70", hot: true },
    { value: 100, label: "R$ 100", hot: true },
  ]

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setDepositAmount(amount.toString())
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setDepositAmount(value)
    setSelectedAmount(null)
  }

  const generatePixCode = (amount: number) => {
    // Simulate PIX code generation
    const randomCode = Math.random().toString(36).substring(2, 15).toUpperCase()
    return `00020126580014BR.GOV.BCB.PIX0136${randomCode}5204000053039865802BR5925RASPOU PREMIOS LTDA6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  }

  const handleDeposit = async () => {
    const amount = Number.parseFloat(depositAmount)
    if (amount >= 20) {
      setIsProcessing(true)

      try {
        console.log("[v0] Creating Genesis payment transaction")

        const response = await fetch("/api/payments/create-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            customerData: {
              name: session.user?.name || "Usuário Raspou Prêmios",
              email: session.user?.email || "user@raspoupremios.com",
              phone: session.user?.phone || "11999999999",
              document: session.user?.document || "00000000000",
            },
          }),
        })

        const result = await response.json()
        console.log("[v0] Payment API response:", result)

        if (result.success && result.pixPayload) {
          setPixCode(result.pixPayload)
          setTransactionId(result.transaction.id)
          setPaymentStep("processing")
          setTimeRemaining(300) // Reset timer to 5 minutes

          startPaymentStatusPolling(result.transaction.id)
        } else {
          throw new Error(result.error || "Falha ao criar transação")
        }
      } catch (error) {
        console.error("[v0] Error creating payment:", error)
        alert("Erro ao processar pagamento. Tente novamente.")
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const startPaymentStatusPolling = (transactionId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/payments/check-status/${transactionId}`)
        const result = await response.json()

        if (result.status === "AUTHORIZED") {
          clearInterval(pollInterval)

          // Update user balance
          const currentCredits = session.user?.credits || 0
          const bonusMultiplier = 2 // Double deposit bonus
          const creditsToAdd = Number.parseFloat(depositAmount) * bonusMultiplier

          updateUser({
            credits: currentCredits + creditsToAdd,
          })

          setPaymentStep("success")
        } else if (result.status === "FAILED") {
          clearInterval(pollInterval)
          alert("Pagamento falhou. Tente novamente.")
          setPaymentStep("form")
        }
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
      }
    }, 5000) // Check every 5 seconds

    // Stop polling after 10 minutes
    setTimeout(() => {
      clearInterval(pollInterval)
    }, 600000)
  }

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode)
    setIsCopied(true)
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  const generateQRCodeUrl = (pixPayload: string) => {
    // Using QR Server API to generate QR code from PIX payload
    const encodedPayload = encodeURIComponent(pixPayload)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedPayload}`
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleContinue = () => {
    // Remove navigation restrictions and redirect to games
    window.removeEventListener("beforeunload", () => {})
    window.removeEventListener("popstate", () => {})
    router.push("/games")
  }

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Header onOpenAuthModal={() => {}} />

        <div className="flex items-center justify-center p-4 py-20">
          <div className="w-full max-w-md">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Depósito Confirmado!</h1>
                <p className="text-slate-400 mb-6">
                  Seu depósito de R$ {Number.parseFloat(depositAmount).toFixed(2).replace(".", ",")} foi processado com
                  sucesso.
                </p>

                <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6">
                  <p className="text-green-400 font-bold text-lg">Bônus de Depósito em Dobro!</p>
                  <p className="text-slate-300 text-sm">
                    Você recebeu {(Number.parseFloat(depositAmount) * 2).toFixed(2).replace(".", ",")} créditos
                  </p>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg"
                >
                  Começar a Jogar!
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full h-px bg-slate-600"></div>
        <footer className="bg-slate-800 text-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/raspou-premios-logo.png"
                  alt="Raspou Prêmios"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-slate-500 text-xs">
                © 2025 Raspou Prêmios - Kovr Capitalização S.A. – KOVRCAP CNPJ n.º 93.202.448/0001-79
              </p>
              <p className="text-slate-500 text-xs">Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Header onOpenAuthModal={() => {}} />

        <div className="flex items-center justify-center p-4 py-20">
          <div className="w-full max-w-md">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">Aguardando Pagamento</h1>
                  <p className="text-slate-400">Escaneie o QR Code ou copie o código PIX para fazer o pagamento</p>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      {pixCode ? (
                        <div className="flex flex-col items-center">
                          <Image
                            src={generateQRCodeUrl(pixCode) || "/placeholder.svg"}
                            alt="QR Code PIX"
                            width={160}
                            height={160}
                            className="rounded-lg mb-2"
                          />
                          <p className="text-gray-600 text-sm">Escaneie com seu app do banco</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="w-32 h-32 bg-black mx-auto mb-2 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs">QR CODE</span>
                          </div>
                          <p className="text-gray-600 text-sm">Escaneie com seu app do banco</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* PIX Code */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Ou copie o código PIX:</label>
                  <div className="flex gap-2">
                    <Input value={pixCode} readOnly className="bg-slate-700 border-slate-600 text-white text-xs" />
                    <Button
                      onClick={copyPixCode}
                      variant="outline"
                      size="sm"
                      className={`border-slate-600 hover:bg-slate-700 transition-all duration-200 ${
                        isCopied ? "bg-green-600 border-green-500 text-white" : "text-slate-300 bg-transparent"
                      }`}
                    >
                      {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-slate-700 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Valor:</span>
                    <span className="text-white font-bold">
                      R$ {Number.parseFloat(depositAmount).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-300">Bônus:</span>
                    <span className="text-green-400 font-bold">100% (Dobro)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total de créditos:</span>
                    <span className="text-yellow-400 font-bold">
                      {(Number.parseFloat(depositAmount) * 2).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>

                {/* Timer */}
                <div className="text-center mb-4">
                  <p className="text-slate-400 text-sm">
                    Tempo restante: <span className="text-orange-400 font-bold">{formatTime(timeRemaining)}</span>
                  </p>
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                  <h3 className="text-blue-400 font-bold mb-2">Como pagar:</h3>
                  <ol className="text-slate-300 text-sm space-y-1">
                    <li>1. Abra o app do seu banco</li>
                    <li>2. Escolha a opção PIX</li>
                    <li>3. Escaneie o QR Code ou cole o código</li>
                    <li>4. Confirme o pagamento</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full h-px bg-slate-600"></div>
        <footer className="bg-slate-800 text-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/raspou-premios-logo.png"
                  alt="Raspou Prêmios"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-slate-500 text-xs">
                © 2025 Raspou Prêmios - Kovr Capitalização S.A. – KOVRCAP CNPJ n.º 93.202.448/0001-79
              </p>
              <p className="text-slate-500 text-xs">Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://cdn.xtracky.com/scripts/interceptor.js"
        data-token="075774c6-bd2c-45b2-9d91-11ad6faf7766"
        data-click-id-param="click_id"
        strategy="afterInteractive"
      />

      <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
        <Header onOpenAuthModal={() => {}} />

        <div className="flex items-center justify-center p-4 py-20">
          <div className="w-full max-w-md">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CreditCard className="w-6 h-6 text-white" />
                    <h1 className="text-2xl font-bold text-white">Depositar</h1>
                  </div>
                  <p className="text-slate-400 text-sm">Faça seu primeiro depósito para começar a jogar!</p>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Método de Pagamento:</label>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 border-2 border-blue-500 relative shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2">
                          <Image
                            src="/pix-logo-official.png"
                            alt="PIX"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg">PIX</p>
                          <p className="text-blue-100 text-sm font-medium">Transferência em tempo real</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl blur-xl -z-10"></div>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Valor a ser depositado:</label>
                  <div className="flex items-center gap-3">
                    <Image
                      src="/brazil-flag.png"
                      alt="Brasil"
                      width={24}
                      height={24}
                      className="rounded-full object-cover flex-shrink-0"
                    />
                    <div className="relative flex-1">
                      <Input
                        type="text"
                        value={depositAmount ? `R$ ${depositAmount}` : ""}
                        onChange={handleAmountChange}
                        placeholder="R$ 30"
                        className="bg-slate-700 border-slate-600 text-white px-4 py-3 text-lg"
                      />
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-2">Depósito mínimo R$ 20,00</p>
                </div>

                {/* Suggested Amounts */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-300 mb-3">Valores sugeridos:</label>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestedAmounts.map((amount) => (
                      <button
                        key={amount.value}
                        onClick={() => handleAmountSelect(amount.value)}
                        className={`relative p-3 rounded-lg border-2 transition-all ${
                          selectedAmount === amount.value
                            ? "bg-green-600 border-green-500 text-white"
                            : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <span className="font-medium">{amount.label}</span>
                        {amount.hot && (
                          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            HOT
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deposit Button */}
                <Button
                  onClick={handleDeposit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-lg mb-6"
                  disabled={!depositAmount || Number.parseFloat(depositAmount) < 20 || isProcessing}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {isProcessing ? "Processando..." : "Depositar Agora"}
                </Button>

                {/* Security Info */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-green-400 font-medium text-sm">Transação 100% Segura</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Seus dados são protegidos com criptografia de nível bancário. Processamento instantâneo e confiável.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="w-full h-px bg-slate-600"></div>
        <footer className="bg-slate-800 text-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/raspou-premios-logo.png"
                  alt="Raspou Prêmios"
                  width={64}
                  height={64}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <p className="text-slate-500 text-xs">
                © 2025 Raspou Prêmios - Kovr Capitalização S.A. – KOVRCAP CNPJ n.º 93.202.448/0001-79
              </p>
              <p className="text-slate-500 text-xs">Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
