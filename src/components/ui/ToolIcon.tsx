import { getTool } from '../../data/tools'

const SIZES = { sm: 'h-7 w-7 rounded-lg', md: 'h-9 w-9 rounded-xl', lg: 'h-11 w-11 rounded-xl' }
const ICON = { sm: 14, md: 17, lg: 20 }

/** Ícono de herramienta en una baldosa tintada con su color. Decorativo salvo que se pida etiqueta. */
export function ToolIcon({ id, size = 'md', label = false }: { id: string; size?: keyof typeof SIZES; label?: boolean }) {
  const tool = getTool(id)
  if (!tool) return null
  const Icon = tool.icon
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center border border-line ${SIZES[size]}`}
      style={{ background: `color-mix(in oklab, ${tool.color} 16%, var(--c-surface))`, color: tool.color }}
      title={tool.nombre}
      {...(label ? { role: 'img', 'aria-label': tool.nombre } : { 'aria-hidden': true })}
    >
      <Icon size={ICON[size]} strokeWidth={2.1} />
    </span>
  )
}

/** Íconos superpuestos para las tarjetas; el nombre completo va en texto oculto para lectores de pantalla */
export function ToolStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const shown = ids.slice(0, max)
  const rest = ids.length - shown.length
  const names = ids.map((id) => getTool(id)?.nombre ?? id).join(', ')
  return (
    <span className="flex items-center">
      <span className="sr-only">Conecta: {names}</span>
      {shown.map((id, i) => (
        <span key={id} className={i > 0 ? '-ml-2' : ''} style={{ zIndex: shown.length - i }}>
          <span className="block rounded-xl ring-2 ring-surface">
            <ToolIcon id={id} size="sm" />
          </span>
        </span>
      ))}
      {rest > 0 && (
        <span aria-hidden className="-ml-2 flex h-7 min-w-7 items-center justify-center rounded-lg border border-line bg-surface-2 px-1 text-[11px] font-medium text-ink-soft ring-2 ring-surface">
          +{rest}
        </span>
      )}
    </span>
  )
}
