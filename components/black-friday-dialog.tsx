"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tag, Sparkles } from "lucide-react"
import Link from "next/link"

export function BlackFridayDialog() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        // Show dialog after a short delay to ensure hydration and smooth entrance
        const timer = setTimeout(() => {
            const hasSeenOffer = localStorage.getItem("black-friday-offer-seen")
            if (!hasSeenOffer) {
                setOpen(true)
            }
        }, 1500)

        return () => clearTimeout(timer)
    }, [])

    const handleClose = () => {
        setOpen(false)
        localStorage.setItem("black-friday-offer-seen", "true")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md border-2 border-primary/50 bg-background/95 backdrop-blur-xl shadow-2xl shadow-primary/20">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Tag className="w-6 h-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ¡Black Friday IOT!
                    </DialogTitle>
                    <DialogDescription className="text-center text-base pt-2">
                        Oferta exclusiva para alumnos de IOT.
                        <br />
                        Obtén acceso <span className="font-semibold text-foreground">Premium</span> con un 50% de descuento.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-muted/50 p-4 rounded-lg border border-border my-2">
                    <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold">Beneficios Exclusivos:</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-1">
                        <li>Monitoreo ilimitado de dispositivos</li>
                        <li>Análisis predictivo avanzado</li>
                        <li>Soporte prioritario 24/7</li>
                    </ul>
                </div>

                <DialogFooter className="flex-col sm:flex-col gap-2">
                    <Link href="/register?promo=BLACKFRIDAY_IOT" className="w-full">
                        <Button className="w-full text-lg font-semibold shadow-lg shadow-primary/25" size="lg" onClick={handleClose}>
                            Reclamar Oferta
                        </Button>
                    </Link>
                    <Button variant="ghost" onClick={handleClose} className="text-muted-foreground hover:text-foreground">
                        No gracias, prefiero pagar precio completo
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
