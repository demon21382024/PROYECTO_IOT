"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wifi, ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulación de login
    if (email && password) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("userEmail", email)
      window.location.href = "/dashboard"
    } else {
      setError("Por favor completa todos los campos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 text-foreground hover:text-primary transition">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <Card className="p-8 border border-border shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-6">
            <Wifi className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">Ingresar</h1>
          <p className="text-center text-muted-foreground mb-8">Bienvenido de vuelta a LitterFlow</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full bg-transparent">
              Google
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              Apple
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Registrate
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
