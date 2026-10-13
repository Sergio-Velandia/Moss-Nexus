import { CalendarClock, KeyRound, MessageSquareText, Repeat, Scale, Table2, Wrench } from 'lucide-react'
import { Reveal } from '../ui/Reveal'

const AJUSTES = [
  { icon: Table2, title: 'Tus datos', text: 'Nombres de hojas, columnas y campos de formularios.' },
  { icon: MessageSquareText, title: 'Tus textos', text: 'El tono de correos, avisos y mensajes a clientes.' },
  { icon: Scale, title: 'Tus reglas', text: 'Montos, días, umbrales y quién aprueba qué.' },
  { icon: CalendarClock, title: 'Tus horarios', text: 'Frecuencia, zona horaria y formatos de fecha o moneda.' },
  { icon: Repeat, title: 'Tus herramientas', text: 'Cambiar un servicio por otro: Gmail por Outlook, Slack por Teams.' },
  { icon: KeyRound, title: 'Tus accesos', text: 'Credenciales, permisos y cuentas de cada servicio.' },
]

/** Aclara que cada plantilla es un punto de partida y casi siempre requiere ajustes */
export function Customize() {
  return (
    <section aria-labelledby="ajustes-title" className="mx-auto max-w-6xl px-4 py-12">
      <Reveal className="relative overflow-hidden rounded-3xl border border-amber/30 bg-amber/[0.05] p-6 sm:p-10">
        <div aria-hidden className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber/10 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber/15 text-amber">
              <Wrench size={20} aria-hidden />
            </span>
            <p className="mt-5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-amber">Antes de copiar</p>
            <h2 id="ajustes-title" className="mt-3 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Un punto de partida, no una solución cerrada
            </h2>
            <p className="mt-3 text-pretty text-ink-soft">
              Cada persona y cada empresa trabaja distinto. Las plantillas resuelven el caso común y casi siempre necesitan
              ajustes para encajar con tu operación. En n8n puedes cambiar cualquier nodo, y cada plantilla te dice qué revisar
              en sus pasos.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {AJUSTES.map((a) => (
              <li key={a.title} className="glass flex gap-3 rounded-2xl p-4">
                <a.icon size={18} className="mt-0.5 shrink-0 text-amber" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold">{a.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-soft">{a.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
