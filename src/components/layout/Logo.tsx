/** Marca de Moss Nexus: un nodo musgo conectado a un nodo coral. Mismo dibujo que el favicon. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
      <rect width="64" height="64" rx="16" fill="var(--c-surface-2)" stroke="var(--c-line-strong)" />
      <path d="M20 22c10 0 12 20 24 20" fill="none" stroke="var(--c-nexus)" strokeWidth="4" strokeLinecap="round" />
      <rect x="9" y="13" width="18" height="18" rx="6" fill="var(--c-moss)" />
      <rect x="37" y="33" width="18" height="18" rx="6" fill="var(--c-nexus)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[15px] font-semibold tracking-tight">
        Moss <span className="text-nexus">Nexus</span>
      </span>
    </span>
  )
}
