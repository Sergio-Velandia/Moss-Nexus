import { Check, X } from 'lucide-react'
import { Reveal, SectionHeading } from '../ui/Reveal'

const pains = ['Webhooks', 'JSON', 'Tokens y OAuth', 'Expresiones', 'Credenciales', 'Manejo de errores', 'Nodos IF']
const gains = [
  'El flujo completo, ya conectado',
  'Qué hace cada paso, en palabras claras',
  'Qué cuentas necesitas antes de empezar',
  'Pasos numerados hasta tenerlo funcionando',
]

export function Problem() {
  return (
    <section aria-labelledby="problema-title" className="mx-auto max-w-6xl px-4 py-20">
      <SectionHeading
        id="problema-title"
        eyebrow="El problema"
        title={
          <>
            Sabes el resultado. <span className="text-ink-soft">Lo difícil es el camino.</span>
          </>
        }
        intro="La mayoría se paraliza antes de terminar su primer flujo. No por falta de ideas, sino por todo lo técnico que hay en medio."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        <Reveal className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-nexus/15 text-nexus">
              <X size={14} aria-hidden />
            </span>
            Sin Nexus, empiezas aquí
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Conceptos técnicos que frenan">
            {pains.map((p, i) => (
              <li
                key={p}
                className="rounded-lg border border-dashed border-line-strong px-3 py-1.5 font-mono text-xs text-faint"
                style={{ transform: `rotate(${((i * 37) % 7) - 3}deg)` }}
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-soft">
            Horas de tutoriales, foros y pruebas a ciegas para algo que parecía sencillo.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="relative overflow-hidden rounded-3xl border border-moss/25 bg-moss/[0.07] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-moss">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-moss/20">
              <Check size={14} aria-hidden />
            </span>
            Con Nexus, empiezas con
          </p>
          <ul className="mt-6 space-y-3">
            {gains.map((g) => (
              <li key={g} className="flex items-start gap-3">
                <Check size={18} className="mt-0.5 shrink-0 text-moss" aria-hidden />
                <span>{g}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
