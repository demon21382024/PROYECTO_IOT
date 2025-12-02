"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { createBrowserSupabaseClient } from "@/lib/db"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Check } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    catName: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserSupabaseClient()

  const handleNext = async () => {
    if (step === 1) {
      if (formData.name && formData.email) {
        setStep(2)
        setError("")
      } else {
        setError("Por favor completa todos los campos")
      }
    } else if (step === 2) {
      if (formData.password === formData.confirmPassword && formData.password.length >= 6) {
        setStep(3)
        setError("")
      } else {
        setError("Las contraseñas no coinciden o son muy cortas")
      }
    } else if (step === 3) {
      if (formData.catName) {
        setLoading(true)
        try {
          // 1. Crear usuario en Supabase Auth
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
              data: {
                full_name: formData.name,
                cat_name: formData.catName, // Guardamos el nombre del gato en metadata por ahora
              },
            },
          })

          if (authError) throw authError

          // 2. (Opcional) Aquí podrías guardar datos adicionales en una tabla 'profiles' o 'cats'
          // usando supabase.from('cats').insert(...)

          // Éxito
          router.push("/dashboard")
        } catch (err: any) {
          console.error("Error de registro:", err)
          setError(err.message || "Ocurrió un error al registrarse")
        } finally {
          setLoading(false)
        }
      } else {
        setError("Por favor ingresa el nombre de tu gato")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8 text-foreground hover:text-primary transition">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <Card className="p-8 border border-border shadow-lg">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6">
            <img src="/logo_cat.png" alt="LitterFlow Logo" className="w-full h-full" />
          </div>

          <h1 className="text-3xl font-bold text-center text-foreground mb-2">Crear cuenta</h1>
          <p className="text-center text-muted-foreground mb-8">Paso {step} de 3</p>

          {/* Progress Indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Mín. 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Repite tu contraseña"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nombre de tu Gato</label>
                <input
                  type="text"
                  name="catName"
                  value={formData.catName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Ej: Michi, Feliz, Luna"
                />
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm text-foreground">
                <p className="font-medium mb-2">Tu plan gratuito incluye:</p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Monitoreo en tiempo real
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Historial de 24 horas
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />1 Perfil de gato
                  </li>
                </ul>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mt-6">
              {error}
            </div>
          )}

          <Button onClick={handleNext} className="w-full mt-6" disabled={loading}>
            {loading ? "Creando cuenta..." : step === 3 ? "Crear Cuenta" : "Continuar"}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Ingresar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
