"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BookOpenText, BarChart, Sparkles, Menu, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getUserCredits } from "@/lib/actions"
import { Badge } from "@/components/ui/badge"

const navItems = [
  { name: "Journal", href: "/", icon: BookOpenText },
  { name: "Insights", href: "/insights", icon: BarChart },
  { name: "Templates", href: "/templates", icon: Sparkles },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const { isSignedIn } = useAuth()

  useEffect(() => {
    async function fetchCredits() {
      if (isSignedIn) {
        try {
          const userCredits = await getUserCredits()
          setCredits(userCredits)
        } catch (error) {
          console.error("Failed to fetch credits:", error)
        }
      }
    }

    fetchCredits()
  }, [isSignedIn, pathname])

  if (!isSignedIn) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <div className="px-7">
                <Link href="/" className="flex items-center" onClick={() => setMobileOpen(false)}>
                  <span className="font-bold text-xl">journal</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 mt-8 px-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
              {credits !== null && (
                <div className="px-7 mt-6">
                  <Link href="/pricing" onClick={() => setMobileOpen(false)}>
                    <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span>{credits} credits</span>
                    </Badge>
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl hidden sm:inline-block ml-4">journal</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {credits !== null && (
            <Link href="/pricing" className="hidden md:flex">
              <Badge variant="outline" className="flex items-center gap-1.5 px-3 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>{credits} credits</span>
              </Badge>
            </Link>
          )}
          <ModeToggle />
          <SignedOut>
            <div className="hidden sm:flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Sign up</Button>
              </SignUpButton>
            </div>
            <div className="sm:hidden">
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Sign in</span>
                  <BookOpenText className="h-5 w-5" />
                </Button>
              </SignInButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  )
}
