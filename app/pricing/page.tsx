"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ArrowRight } from "lucide-react"
import { ContactSalesDialog } from "@/components/contact-sales-dialog"

export default function PricingPage() {
  const plans = [
    {
      name: "Essential",
      price: "$0",
      description: "Perfecto para conocer LitterFlow",
      features: [
        "Monitoreo en tiempo real",
        "Historial de últimas 24 horas",
        "Soporte para 1 Perfil de Gato",
        "Alertas básicas",
        "Acceso web",
      ],
      notIncluded: [
        "Historial extendido",
        "Alertas avanzadas de IA",
        "Reportes PDF",
        "Múltiples gatos",
        "Soporte prioritario",
      ],
      cta: "Comenzar Gratis",
      highlight: false,
    },
    {
      name: "Care",
      price: "$9.99",
      period: "/mes",
      description: "Para dueños que cuidan cada detalle",
      features: [
        "Monitoreo en tiempo real",
        "Historial de datos de 30 días",
        "Alertas de anomalías de salud",
        "Soporte para hasta 2 Gatos",
        "Análisis básico de tendencias",
        "Acceso web y móvil",
        "Exportación básica de datos",
      ],
      notIncluded: [
        "Historial ilimitado",
        "IA Avanzada diagnóstica",
        "Reportes PDF veterinarios",
        "Más de 2 gatos",
        "Soporte prioritario 24/7",
      ],
      cta: "Actualizar a Care",
      highlight: true,
    },
    {
      name: "Guardian",
      price: "$9.99",
      originalPrice: "$19.99",
      badge: "OFERTA IOT",
      period: "/mes",
      description: "Máximo control para expertos en mascotas",
      features: [
        "Historial de datos ilimitado de por vida",
        "IA Avanzada para diagnósticos tempranos",
        "Exportación de reportes PDF veterinarios",
        "Perfiles de gatos ilimitados",
        "Soporte prioritario 24/7",
        "Análisis predictivo avanzado",
        "Integración veterinaria",
        "Acceso API",
      ],
      notIncluded: [],
      cta: "Obtener Guardian",
      highlight: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/logo.svg" alt="LitterFlow Logo" className="w-full h-full" />
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Planes Simples y Transparentes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Elige el plan perfecto para cuidar a tu gato. Sin sorpresas, sin compromisos a largo plazo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col border-2 transition ${plan.highlight
                ? "border-primary ring-2 ring-primary/20 scale-105"
                : "border-border hover:border-primary/50"
                }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-semibold whitespace-nowrap">
                    MÁS POPULAR
                  </span>
                </div>
              )}
              {plan.badge && (
                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden rounded-tr-xl">
                  <div className="absolute top-5 -right-10 rotate-45 w-32 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center py-1 shadow-lg">
                    <span className="text-[10px] font-bold uppercase tracking-wider drop-shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                </div>
              )}

              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-2xl text-muted-foreground line-through">{plan.originalPrice}</span>
                    )}
                    {plan.period && <span className="text-muted-foreground ml-2">{plan.period}</span>}
                  </div>
                  {plan.name === "Essential" && (
                    <p className="text-sm text-muted-foreground mt-2">Para siempre gratis</p>
                  )}
                  {plan.name === "Care" && <p className="text-sm text-muted-foreground mt-2">Facturación mensual</p>}
                  {plan.name === "Guardian" && <p className="text-sm text-muted-foreground mt-2">Máximo valor</p>}
                </div>

                <Button className="w-full mb-8" variant={plan.highlight ? "default" : "outline"}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="space-y-3">
                  <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Incluido</p>
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}

                  {plan.notIncluded.length > 0 && (
                    <>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-4">
                        No incluido
                      </p>
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-start gap-3 opacity-50">
                          <div className="w-5 h-5 border-2 border-border rounded flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Preguntas Frecuentes</h2>

          <div className="space-y-6">
            {[
              {
                q: "¿Puedo cambiar de plan en cualquier momento?",
                a: "Sí, puedes cambiar o cancelar tu plan en cualquier momento. Los cambios se aplican en tu próximo ciclo de facturación.",
              },
              {
                q: "¿Qué pasa con mis datos si cancelo?",
                a: "En el plan Essential tu historial se mantiene por 30 días. En Care se guarda por 90 días. Con Guardian, tus datos se guardan de por vida.",
              },
              {
                q: "¿Hay descuentos por pago anual?",
                a: "Sí, los planes anuales tienen un 20% de descuento. Contáctanos para conocer más detalles.",
              },
              {
                q: "¿Incluye acceso a la API?",
                a: "El acceso a API está disponible solo en el plan Guardian. Para Care, consultanos sobre planes personalizados.",
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center space-y-6 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <h3 className="text-3xl font-bold text-foreground">¿Dudas sobre qué plan elegir?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte. Contacta con nosotros para una recomendación personalizada.
          </p>
          <ContactSalesDialog triggerLabel="Contactar Ventas" />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background mt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 LitterFlow. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
