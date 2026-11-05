import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Baja hasta el #ancla al abrir una página. El navegador lo intenta al cargar, cuando una página con carga
 * perezosa todavía no existe. Va dentro del mismo Suspense que la página: su efecto corre cuando ya está en el DOM.
 */
export function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
  }, [pathname, hash])
  return null
}
