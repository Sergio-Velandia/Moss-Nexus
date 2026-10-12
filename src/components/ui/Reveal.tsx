import type { ReactNode } from 'react'
import { motion } from 'motion/react'

/**
 * Aparece al entrar en pantalla (una sola vez) con un resorte suave.
 * Con movimiento reducido, MotionConfig omite el desplazamiento y queda solo el fundido.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}) {
  const Tag = motion[as]
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 22, delay }}
    >
      {children}
    </Tag>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  id,
  align = 'left',
}: {
  eyebrow: string
  title: ReactNode
  intro?: string
  id?: string
  align?: 'left' | 'center'
}) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-nexus">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-pretty text-ink-soft">{intro}</p>}
    </Reveal>
  )
}
