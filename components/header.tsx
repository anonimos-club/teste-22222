"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { User, UserPlus, ArrowRight, LogOut } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  onOpenAuthModal?: (mode: "login" | "register") => void
}

export function Header({ onOpenAuthModal }: HeaderProps) {
  const { session, logout } = useAuth()

  return (
    <header className="bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/raspou-premios-logo.png"
                alt="Raspou Prêmios"
                width={160}
                height={53}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {session.isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="font-medium">Saldo</span>
                  <span className="text-green-400 font-bold">0,00</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full hover:bg-slate-600 flex items-center gap-1"
                    >
                      <User className="w-4 h-4 text-slate-200" />
                      <svg className="w-3 h-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-700 border-slate-600">
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-slate-200 hover:bg-slate-600 cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  onClick={() => onOpenAuthModal?.("login")}
                  className="bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4" />
                  Entrar
                </Button>
                <Button
                  onClick={() => onOpenAuthModal?.("register")}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
