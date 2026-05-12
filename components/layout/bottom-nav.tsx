"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeftRight, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/dashboard/transactions",
    label: "Transactions",
    icon: ArrowLeftRight,
    exact: false,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
      <ul className="flex h-16 items-stretch">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs transition-colors",
                  active
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
