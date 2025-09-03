"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { Game } from "@/lib/types"

interface ScratchCardProps {
  game: Game
  result: { isWinner: boolean; prize?: any; winAmount?: number } | null
  onComplete: () => void
}

export function ScratchCard({ game, result, onComplete }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [scratchedPercentage, setScratchedPercentage] = useState(0)
  const [symbols, setSymbols] = useState<string[]>([])
  const [isRevealed, setIsRevealed] = useState(false)

  // Generate random symbols for the scratch card
  useEffect(() => {
    const possibleSymbols = ["🍎", "🍊", "🍋", "🍇", "🍓", "🥝", "🍑", "🍌"]
    const cardSymbols = []

    if (result?.isWinner) {
      // If winner, ensure at least 3 matching symbols
      const winningSymbol = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)]
      cardSymbols.push(winningSymbol, winningSymbol, winningSymbol)

      // Fill remaining spots with random symbols
      for (let i = 3; i < 9; i++) {
        cardSymbols.push(possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)])
      }
    } else {
      // If not winner, ensure no 3 matching symbols
      for (let i = 0; i < 9; i++) {
        cardSymbols.push(possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)])
      }
    }

    // Shuffle the symbols
    for (let i = cardSymbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[cardSymbols[i], cardSymbols[j]] = [cardSymbols[j], cardSymbols[i]]
    }

    setSymbols(cardSymbols)
  }, [result])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 400
    canvas.height = 300

    // Draw the scratch-off surface
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#c0c0c0")
    gradient.addColorStop(1, "#808080")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add texture
    ctx.fillStyle = "#999"
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.fillRect(x, y, 2, 2)
    }

    // Add "RASPE AQUI" text
    ctx.fillStyle = "#666"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("RASPE AQUI", canvas.width / 2, canvas.height / 2)

    ctx.font = "16px Arial"
    ctx.fillText("Use o mouse para raspar", canvas.width / 2, canvas.height / 2 + 30)
  }, [])

  const scratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    // Scale coordinates to canvas size
    x = (x / rect.width) * canvas.width
    y = (y / rect.height) * canvas.height

    ctx.globalCompositeOperation = "destination-out"
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, 2 * Math.PI)
    ctx.fill()

    // Calculate scratched percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data
    let transparent = 0

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++
    }

    const percentage = (transparent / (pixels.length / 4)) * 100
    setScratchedPercentage(percentage)

    if (percentage > 60 && !isRevealed) {
      setIsRevealed(true)
      onComplete()
    }
  }

  const handleMouseDown = () => setIsScratching(true)
  const handleMouseUp = () => setIsScratching(false)
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isScratching) scratch(e)
  }

  const handleTouchStart = () => setIsScratching(true)
  const handleTouchEnd = () => setIsScratching(false)
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (isScratching) scratch(e)
  }

  return (
    <div className="text-center">
      <div className="relative inline-block">
        {/* Background with symbols */}
        <div className="absolute inset-0 bg-slate-600 rounded-lg">
          <div className="grid grid-cols-3 gap-4 p-8 h-full">
            {symbols.map((symbol, index) => (
              <div
                key={index}
                className="flex items-center justify-center text-4xl bg-yellow-100 rounded-lg border-2 border-yellow-300"
              >
                {symbol}
              </div>
            ))}
          </div>
        </div>

        {/* Scratch canvas */}
        <canvas
          ref={canvasRef}
          className="relative z-10 cursor-crosshair rounded-lg"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="mt-4">
        <div className="text-sm text-gray-600 mb-2">Progresso: {Math.round(scratchedPercentage)}%</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${scratchedPercentage}%` }}
          />
        </div>
      </div>

      {isRevealed && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-gray-600">
            {result?.isWinner
              ? "Procure por 3 símbolos iguais para confirmar sua vitória!"
              : "Continue tentando! A sorte pode estar na próxima cartela."}
          </p>
        </div>
      )}
    </div>
  )
}
