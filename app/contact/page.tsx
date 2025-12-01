"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Wifi, ArrowLeft } from "lucide-react"

export default function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    console.log("Datos del formulario de contacto:", data)

    toast.success("Mensaje enviado con éxito", {
      description: "Gracias por contactarnos. Nos pondremos en contacto contigo pronto.",
    })

    // Limpiar el formulario después del envío
    event.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">LitterFlow</span>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <Link href="/pricing" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
             <ArrowLeft className="w-4 h-4" />
             Volver a Planes
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Contacta con Ventas</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Rellena el formulario y nuestro equipo se pondrá en contacto contigo lo antes posible.
          </p>
        </div>

        <Card className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" name="name" placeholder="Tu nombre" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="tu@email.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="¿En qué podemos ayudarte?"
                    className="min-h-[120px]"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button type="submit" size="lg">Enviar Mensaje</Button>
              </div>
            </form>
        </Card>
      </main>
    </div>
  )
}
