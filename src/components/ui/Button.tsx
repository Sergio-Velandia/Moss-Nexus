import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const VARIANTS = {
  primary:
    'bg-nexus text-on-accent shadow-[0_8px_30px_-8px_var(--c-nexus)] hover:brightness-110 hover:-translate-y-0.5',
  secondary: 'glass text-ink hover:border-line-strong hover:-translate-y-0.5',
  ghost: 'text-ink-soft hover:text-ink hover:bg-surface-2',
}

const BASE =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition active:scale-[0.97]'

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  className = '',
  external = false,
}: {
  to: string
  children: ReactNode
  variant?: keyof typeof VARIANTS
  className?: string
  external?: boolean
}) {
  const cls = `${BASE} ${VARIANTS[variant]} ${className}`
  if (external) {
    return (
      <a href={to} className={cls} target="_blank" rel="noreferrer">
        {children}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {children}
    </Link>
  )
}
