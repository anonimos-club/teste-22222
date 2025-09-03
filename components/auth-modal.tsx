"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, User, Phone, Mail, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  })
  const { login, register } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      // Reset form data when modal opens
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
      })
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let success = false
    if (mode === "login") {
      success = await login(formData.email, formData.password)
    } else {
      success = await register(formData.name, formData.email, formData.password, formData.phone)
    }

    if (success) {
      console.log("[v0] Authentication successful, redirecting to deposit page")
      onClose()
      // Use replace instead of push to prevent back navigation
      router.replace("/deposit")
    } else {
      console.log("[v0] Authentication failed")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === "phone") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "")

      // Apply Brazilian phone format: (XX) XXXXX-XXXX
      let formatted = digits
      if (digits.length >= 2) {
        formatted = `(${digits.slice(0, 2)})`
        if (digits.length >= 3) {
          formatted += ` ${digits.slice(2, 7)}`
          if (digits.length >= 8) {
            formatted += `-${digits.slice(7, 11)}`
          }
        }
      }

      // Limit to 11 digits (Brazilian mobile format)
      if (digits.length <= 11) {
        setFormData((prev) => ({ ...prev, [field]: formatted }))
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 border border-slate-700">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {/* Modal content */}
        <div className="space-y-6">
          {mode === "register" ? (
            <>
              {/* Registration form */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <User className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Crie sua conta</h2>
                </div>
                <p className="text-slate-400 text-sm">Preencha abaixo para registrar-se!</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="Digite seu melhor e-mail"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      minLength={6}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">
                  Registrar-se →
                </Button>
              </form>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Já tem uma conta?{" "}
                  <button onClick={() => setMode("login")} className="text-green-400 hover:text-green-300 font-medium">
                    Conecte-se
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Login form */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lock className="w-6 h-6 text-green-400" />
                  <h2 className="text-xl font-bold text-white">Acesse sua conta</h2>
                </div>
                <p className="text-slate-400 text-sm">Digite seus dados para continuar:</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="Usuário ou e-mail"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="Sua senha"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3">
                  Entrar agora →
                </Button>
              </form>

              <div className="text-center">
                <p className="text-slate-400 text-sm">
                  Ainda não tem conta?{" "}
                  <button
                    onClick={() => setMode("register")}
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    Cadastre-se
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
