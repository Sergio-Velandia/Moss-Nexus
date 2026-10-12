import { useEffect } from 'react'

const BASE = 'Moss Nexus · Plantillas de n8n listas para copiar'

/** Cada página fija su título: ayuda a lectores de pantalla, pestañas del navegador e historial. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Moss Nexus` : BASE
  }, [title])
}
