"use client"

import { useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BadgeCheck, Bell, CreditCard, Gift, HelpCircle, Mail, MessageSquare } from "lucide-react"

interface SettingsDialogProps {
    children: React.ReactNode
}

export function SettingsDialog({ children }: SettingsDialogProps) {
    const [showPlans, setShowPlans] = useState(false)
    const [currentPlan, setCurrentPlan] = useState("VIP")
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [processingPayment, setProcessingPayment] = useState(false)
    const [paymentSuccess, setPaymentSuccess] = useState(false)

    const plans = [
        { name: "Gratuito", price: "$0", features: ["Monitoreo básico", "1 Gato"] },
        { name: "VIP", price: "$9.99", features: ["Monitoreo avanzado", "3 Gatos", "Alertas de salud"] },
        { name: "BLACK", price: "$19.99", features: ["Todo ilimitado", "Soporte prioritario", "Análisis genético"] },
    ]

    const handlePlanSelect = (planName: string) => {
        setSelectedPlan(planName)
    }

    const handleConfirmChange = () => {
        setProcessingPayment(true)
        // Simular proceso de pago
        setTimeout(() => {
            setProcessingPayment(false)
            setPaymentSuccess(true)
            // Finalizar cambio
            setTimeout(() => {
                if (selectedPlan) setCurrentPlan(selectedPlan)
                setPaymentSuccess(false)
                setSelectedPlan(null)
                setShowPlans(false)
            }, 2000)
        }, 2000)
    }

    if (showPlans) {
        if (paymentSuccess) {
            return (
                <Dialog>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] flex flex-col items-center justify-center py-10">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <BadgeCheck className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl mb-2">¡Pago Exitoso!</DialogTitle>
                        <DialogDescription className="text-center">
                            Tu plan ha sido actualizado a {selectedPlan} correctamente.
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            )
        }

        if (selectedPlan) {
            return (
                <Dialog>
                    <DialogTrigger asChild>{children}</DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Confirmar Cambio de Plan</DialogTitle>
                            <DialogDescription>
                                ¿Estás seguro de que deseas cambiar al plan {selectedPlan}?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-6">
                            <div className="bg-muted/50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Nuevo Plan:</span>
                                    <span className="font-bold">{selectedPlan}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Precio:</span>
                                    <span className="font-bold text-primary">
                                        {plans.find(p => p.name === selectedPlan)?.price} / mes
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Al confirmar, se realizará el cargo a tu método de pago registrado terminada en 4242.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setSelectedPlan(null)} disabled={processingPayment}>
                                Cancelar
                            </Button>
                            <Button onClick={handleConfirmChange} disabled={processingPayment}>
                                {processingPayment ? "Procesando pago..." : "Sí, pagar y cambiar"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            )
        }

        return (
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Elige tu Plan</DialogTitle>
                        <DialogDescription>
                            Selecciona el plan que mejor se adapte a tus necesidades.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition hover:border-primary ${currentPlan === plan.name ? "border-primary bg-primary/5 ring-1 ring-primary" : ""
                                    }`}
                                onClick={() => handlePlanSelect(plan.name)}
                            >
                                <div>
                                    <p className="font-semibold">{plan.name}</p>
                                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                                        {plan.features.map((f, i) => (
                                            <li key={i}>{f}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">{plan.price}</p>
                                    <p className="text-xs text-muted-foreground">/mes</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button variant="outline" onClick={() => setShowPlans(false)}>
                        Volver
                    </Button>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Configuración</DialogTitle>
                    <DialogDescription>
                        Gestiona tu suscripción, preferencias y obtén ayuda.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="subscription" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="subscription">Suscripción</TabsTrigger>
                        <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
                        <TabsTrigger value="support">Soporte</TabsTrigger>
                    </TabsList>

                    {/* Subscription Tab */}
                    <TabsContent value="subscription" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Plan Actual</CardTitle>
                                <CardDescription>Estás suscrito al plan {currentPlan}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5 border-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/20 rounded-full">
                                            <BadgeCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground">Plan {currentPlan}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {plans.find((p) => p.name === currentPlan)?.price} / mes
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => setShowPlans(true)}>
                                        Cambiar Plan
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium">Método de Pago</h4>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">•••• •••• •••• 4242</span>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 text-primary">
                                            Editar
                                        </Button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Button variant="link" className="text-destructive p-0 h-auto text-sm">
                                        Cancelar suscripción
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Preferencias de Notificación</CardTitle>
                                <CardDescription>Elige cómo quieres que te contactemos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center space-x-4">
                                        <Bell className="w-5 h-5 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Alertas Push</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Recibe alertas inmediatas sobre la actividad de tu gato
                                            </p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center space-x-4">
                                        <Mail className="w-5 h-5 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Resumen Semanal</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Reporte por email con estadísticas de salud
                                            </p>
                                        </div>
                                    </div>
                                    <Switch defaultChecked />
                                </div>

                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center space-x-4">
                                        <Gift className="w-5 h-5 text-muted-foreground" />
                                        <div className="space-y-0.5">
                                            <Label className="text-base">Novedades y Ofertas</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Emails sobre nuevas funciones y descuentos
                                            </p>
                                        </div>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Support Tab */}
                    <TabsContent value="support" className="space-y-4 mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Centro de Ayuda</CardTitle>
                                <CardDescription>¿Tienes problemas? Estamos aquí para ayudar</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <Button variant="outline" className="justify-start gap-3 h-12">
                                    <HelpCircle className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-medium">Preguntas Frecuentes</p>
                                        <p className="text-xs text-muted-foreground">Resuelve dudas comunes rápidamente</p>
                                    </div>
                                </Button>

                                <Button variant="outline" className="justify-start gap-3 h-12">
                                    <MessageSquare className="w-5 h-5" />
                                    <div className="text-left">
                                        <p className="font-medium">Chat de Soporte</p>
                                        <p className="text-xs text-muted-foreground">Habla con nuestro equipo técnico</p>
                                    </div>
                                </Button>

                                <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Gift className="w-5 h-5 text-accent" />
                                        <h4 className="font-semibold text-accent">¡Gana 1 mes gratis!</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        Invita a un amigo a LitterFlow y ambos recibirán un mes de servicio Premium gratis.
                                    </p>
                                    <Button className="w-full bg-accent hover:bg-accent/90 text-white">
                                        Copiar enlace de referido
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
