"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/transactions", label: "Transactions" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-lg font-bold">
            Crypto Portfolio
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors hover:text-foreground",
                  pathname === item.href
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <ConnectButton
            accountStatus="address"
            chainStatus="icon"
            showBalance={false}
          />
        </div>
      </div>
    </header>
  )
}
