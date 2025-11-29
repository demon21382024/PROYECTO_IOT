"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronRight, Star, Wifi, Activity, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Wifi className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">LitterFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition">
              Características
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition">
              Planes
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition">
              Testimonios
            </a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Ingresar
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Comenzar</Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 space-y-4">
            <a href="#features" className="block text-sm text-muted-foreground hover:text-foreground">
              Características
            </a>
            <a href="#pricing" className="block text-sm text-muted-foreground hover:text-foreground">
              Planes
            </a>
            <a href="#testimonials" className="block text-sm text-muted-foreground hover:text-foreground">
              Testimonios
            </a>
            <div className="pt-4 space-y-2 border-t border-border">
              <Link href="/login" className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  Ingresar
                </Button>
              </Link>
              <Link href="/register" className="block">
                <Button size="sm" className="w-full">
                  Comenzar
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center bg-gradient-to-b from-muted to-background">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl sm:text-6xl font-bold text-foreground text-balance leading-tight">
                  La Salud de tu Gato en Tus Manos
                </h1>
                <p className="text-xl text-muted-foreground text-balance max-w-lg">
                  Monitorea el bienestar de tu mascota con IA avanzada. Detecta anomalías antes de que se conviertan en
                  problemas.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Comprar Ahora
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Ver Demo
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>4.9/5 - +1,200 gatos monitoreados</span>
              </div>
            </div>

            <div className="relative hidden lg:block h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src="/smart-cat-litter-box-modern-iot-device-premium.jpg"
                alt="LitterFlow Smart Litter Box"
                className="relative rounded-3xl shadow-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Características Inteligentes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tecnología premium diseñada para cuidar a tu mejor amigo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Monitoreo 24/7",
                desc: "Vigilancia continua de la actividad con alertas en tiempo real",
              },
              {
                icon: TrendingUp,
                title: "Análisis de Tendencias",
                desc: "Detecta cambios en el comportamiento antes de que se conviertan en problemas",
              },
              {
                icon: Wifi,
                title: "Control Remoto",
                desc: "Accede a todos los datos desde cualquier lugar, en cualquier momento",
              },
              {
                icon: Users,
                title: "Multi-Gato",
                desc: "Gestiona múltiples perfiles de gatos en una sola plataforma",
              },
              {
                icon: Activity,
                title: "IA Diagnóstica",
                desc: "Inteligencia artificial que predice problemas de salud potenciales",
              },
              {
                icon: Star,
                title: "Reportes Veterinarios",
                desc: "Exporta informes detallados para compartir con tu veterinario",
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-6 border border-border hover:border-primary/50 transition group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Lo que dicen nuestros usuarios</h2>
            <p className="text-lg text-muted-foreground">Historias reales de dueños que cuidan mejor a sus gatos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "María García",
                role: "Dueña de Michi",
                text: "LitterFlow me alertó sobre un cambio en el comportamiento de mi gato. El veterinario confirmó que algo estaba mal. ¡Posiblemente le salvó la vida!",
              },
              {
                name: "Carlos López",
                role: "Dueño de dos gatos",
                text: "La interface es hermosa y fácil de usar. Ver las tendencias de actividad me da tranquilidad todos los días.",
              },
              {
                name: "Ana Martínez",
                role: "Criadora responsable",
                text: "El monitoreo de múltiples gatos es imprescindible. LitterFlow hace exactamente lo que necesitaba.",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="p-6 border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                  <p className="text-muted-foreground text-xs">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">Planes Simples y Transparentes</h2>
            <p className="text-lg text-muted-foreground">Elige el plan perfecto para tu gato</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Gratuito", price: "$0", color: "secondary" },
              { name: "VIP", price: "$9.99", color: "primary", highlight: true },
              { name: "BLACK", price: "$19.99", color: "accent" },
            ].map((plan, i) => (
              <Card
                key={i}
                className={`p-8 border-2 ${plan.highlight ? "border-primary ring-2 ring-primary/20" : "border-border"} relative`}
              >
                {plan.highlight && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold">
                      MÁS POPULAR
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-foreground">{plan.price}</p>
                  <p className="text-sm text-muted-foreground mt-2">/mes</p>
                </div>
                <Link href="/register" className="block mb-6">
                  <Button variant={plan.highlight ? "default" : "outline"} className="w-full">
                    Comenzar
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                Ver todos los detalles de los planes
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">¿Listo para mejorar la salud de tu gato?</h2>
          <p className="text-lg text-muted-foreground">Únete a más de 1,200 gatos monitoreados actualmente</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Comenzar gratuitamente</Button>
            </Link>
            <Button size="lg" variant="outline">
              Contactar ventas
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <Wifi className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">LitterFlow</span>
              </div>
              <p className="text-sm text-muted-foreground">Cuidando gatos con tecnología</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Planes
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Comunidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Términos
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 LitterFlow. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
