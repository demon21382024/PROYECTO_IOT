import { Home, BarChart3, Settings, Users, CreditCard } from "lucide-react"

export default function SidebarNav() {
  const menuItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "Analytics", href: "/analytics" },
    { icon: Users, label: "Mis Gatos", href: "/cats" },
    { icon: CreditCard, label: "Planes", href: "/pricing" },
    { icon: Settings, label: "Configuración", href: "/settings" },
  ]

  return (
    <nav className="space-y-2">
      {menuItems.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-foreground hover:bg-muted transition"
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </a>
      ))}
    </nav>
  )
}
