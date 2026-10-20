import { Suspense, useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, Sprout, X } from 'lucide-react'
import { site } from '../../data/site'
import { Footer } from './Footer'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

const links = [
  { to: '/plantillas', label: 'Plantillas' },
  { to: '/acerca', label: 'Acerca' },
  { to: '/propon-un-flujo', label: 'Propón un flujo' },
]

export default function Layout() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const mainRef = useRef<HTMLElement>(null)
  const firstRender = useRef(true)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // Al cambiar de página: volver arriba y mover el foco al contenido (lectores de pantalla y teclado)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    setMenuOpen(false)
    if (!window.location.hash) {
      window.scrollTo(0, 0)
      mainRef.current?.focus({ preventScroll: true })
    }
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape cierra el menú móvil y devuelve el foco al botón que lo abrió
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      menuBtnRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-ink-soft hover:text-ink'}`

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-nexus focus:px-4 focus:py-2 focus:text-on-accent"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-30 px-4 pt-3">
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-1.5 transition-all duration-300 sm:px-4 ${
            scrolled || menuOpen ? 'glass' : 'border border-transparent'
          }`}
        >
          <Link to="/" className="flex min-h-11 items-center rounded-xl pr-2" aria-label="Moss Nexus, inicio">
            <Logo />
          </Link>

          <div className="flex items-center gap-1">
            <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {l.label}
                      {isActive && (
                        <motion.span
                          layoutId="nav-dot"
                          className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-nexus"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
              <a
                href={site.mossUrl}
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-moss transition hover:bg-moss/10"
              >
                <Sprout size={16} aria-hidden />
                Volver a Moss
              </a>
            </nav>
            <ThemeToggle />
            <button
              type="button"
              ref={menuBtnRef}
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="menu-movil"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink-soft transition hover:bg-surface-2 hover:text-ink md:hidden"
            >
              {menuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              id="menu-movil"
              aria-label="Principal"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              className="glass mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl p-2 md:hidden"
            >
              <NavLink to="/" end className={({ isActive }) => `rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-surface-2 text-ink' : 'text-ink-soft'}`}>
                Inicio
              </NavLink>
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className={({ isActive }) => `rounded-xl px-4 py-3 font-medium ${isActive ? 'bg-surface-2 text-ink' : 'text-ink-soft'}`}
                >
                  {l.label}
                </NavLink>
              ))}
              <a href={site.mossUrl} className="flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-moss">
                <Sprout size={16} aria-hidden />
                Volver a Moss
              </a>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="contenido" ref={mainRef} tabIndex={-1} className="flex-1 outline-none">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}

