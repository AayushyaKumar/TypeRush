"use client"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef } from "react"

export default function Navbar() {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const navbarRef = useRef<HTMLElement>(null)
  const [navHeight, setNavHeight] = useState(56)

  // Measure actual navbar height so the drawer starts exactly below it
  useEffect(() => {
    const el = navbarRef.current
    if (!el) return
    const update = () => setNavHeight(el.offsetHeight)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Close menu on route change (do NOT include isOpen in deps — it would self-close)
  const prevPathname = useRef(pathname)
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname
      setIsOpen(false)
    }
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/practice", label: "Practice" },
    { href: "/race", label: "Race" },
  ]

  return (
    <>
      <header
        ref={navbarRef}
        className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border shadow-sm"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-indigo-500 to-purple-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
              ⚡ TypeRush
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop Auth */}
          <div className="hidden sm:flex items-center gap-4">
            {status === "loading" ? (
              <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>
            ) : session ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    {session.user?.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Racer</span>
                </div>
                {session.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full border border-border shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                    {session.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className="text-xs font-semibold border border-border rounded-xl px-3 py-2 hover:bg-secondary text-foreground hover:border-foreground/20 shadow-sm transition-all cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="text-xs font-semibold bg-primary text-primary-foreground rounded-xl px-3.5 py-2 hover:opacity-90 shadow-sm shadow-primary/10 transition-all cursor-pointer"
              >
                Sign in
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setIsOpen((o) => !o)}
              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer — rendered as a sibling so sticky parent doesn't clip it */}
      {isOpen && (
        <div
          className="sm:hidden fixed left-0 right-0 bottom-0 z-40 overflow-y-auto bg-background/97 backdrop-blur-lg border-t border-border flex flex-col p-6 gap-6 animate-fade-in"
          style={{ top: navHeight }}
        >
          {/* Nav links */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
              Navigation
            </span>
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-base font-semibold px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary dark:bg-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Account section */}
          <div className="border-t border-border/60 pt-6 flex flex-col gap-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Account
            </span>

            {status === "loading" ? (
              <span className="text-sm text-muted-foreground text-center animate-pulse">
                Loading account...
              </span>
            ) : session ? (
              <div className="flex flex-col gap-4">
                {/* Profile card */}
                <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-xl border border-border/40">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User Avatar"}
                      className="w-12 h-12 rounded-full border-2 border-primary/30 shadow-sm flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base flex-shrink-0">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground truncate">
                      {session.user?.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      {session.user?.email}
                    </div>
                    <div className="text-[10px] text-primary font-semibold mt-0.5">
                      🏎️ Racer
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false)
                    signOut()
                  }}
                  className="w-full py-3.5 border border-border text-foreground font-semibold rounded-xl text-sm hover:bg-secondary transition-all cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsOpen(false)
                  signIn("google")
                }}
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl text-sm hover:opacity-90 transition-all text-center shadow-lg shadow-primary/10 cursor-pointer"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
