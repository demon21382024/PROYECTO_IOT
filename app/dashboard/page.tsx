"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabaseClient } from "@/lib/db"
import { LogOut, Settings, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileDialog } from "@/components/dashboard/profile-dialog"
import DashboardContent from "@/components/dashboard/dashboard-content"

import { SettingsDialog } from "@/components/dashboard/settings-dialog"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [catName, setCatName] = useState("")
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          router.push("/login")
        } else {
          setIsAuthenticated(true)
          setUserEmail(session.user.email || "")
          // Intentamos obtener el nombre del gato de los metadatos
          setCatName(session.user.user_metadata?.cat_name || "Gato")
        }
      } catch (error) {
        console.error("Error checking session:", error)
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">LitterFlow</h1>

          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-muted transition">
              <Bell className="w-5 h-5 text-foreground" />
            </button>
            <SettingsDialog>
              <button className="p-2 rounded-lg hover:bg-muted transition">
                <Settings className="w-5 h-5 text-foreground" />
              </button>
            </SettingsDialog>
            <ProfileDialog userEmail={userEmail} catName={catName}>
              <button className="p-2 rounded-lg hover:bg-muted transition flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </button>
            </ProfileDialog>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContent catName={catName} userEmail={userEmail} />
      </div>
    </div>
  )
}
