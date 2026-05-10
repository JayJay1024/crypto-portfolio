import { BottomNav } from "@/components/layout/bottom-nav"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <Toaster />
    </div>
  )
}
