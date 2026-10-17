import { useState } from 'react'
import { Check, Copy, ExternalLink, Mail } from 'lucide-react'
import { LegalPage } from '../components/legal/LegalPage'
import { site } from '../data/site'
import { copyText } from '../lib/clipboard'

// El correo no aparece legible ni en el HTML ni en el código: se guarda invertido y se arma al pulsar el botón.
// Frena a los recolectores de correos simples; no a una persona decidida, y no pretende hacerlo.
const PARTES = ['otcatnoc', 'ved.aidnalev-oigres']
const armarCorreo = () => PARTES.map((p) => [...p].reverse().join('')).join('@')

function RevealEmail() {
  const [correo, setCorreo] = useState<string | null>(null)
  const [copiado, setCopiado] = useState(false)

  if (!correo) {
    return (
      <button
        type="button"
        onClick={() => setCorreo(armarCorreo())}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong px-4 text-sm font-semibold text-ink transition hover:border-nexus/50 hover:text-nexus"
      >
        <Mail size={16} aria-hidden />
        Mostrar correo
      </button>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-2" role="status" aria-live="polite">
      <a href={`mailto:${correo}`} className="glass inline-flex min-h-11 items-center gap-2 rounded-xl px-4 font-mono text-sm !text-ink !no-underline">
        <Mail size={16} className="text-nexus" aria-hidden />
        {correo}
      </a>
      <button
        type="button"
        onClick={async () => setCopiado(await copyText(correo))}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium text-ink-soft transition hover:bg-surface-2 hover:text-ink"
      >
        {copiado ? <Check size={16} className="text-moss" aria-hidden /> : <Copy size={16} aria-hidden />}
        {copiado ? 'Copiado' : 'Copiar'}
      </button>
    </div>
  )
}

export default function Contact() {
  return (
    <LegalPage
      title="Contacto"
      updated={site.legalUpdated}
      intro={
        <p>
          Moss Nexus no tiene formulario de contacto, porque no tiene servidor que lo reciba. Estos son los dos canales para
          escribirme.
        </p>
      }
      sections={[
        {
          id: 'github',
          title: 'GitHub Issues (recomendado)',
          content: (
            <>
              <p>
                Es el mejor canal para reportar un error en una plantilla, avisar que un flujo dejó de funcionar con una versión
                nueva de n8n, sugerir una plantilla o señalar un problema del sitio. Las conversaciones son públicas y pueden
                ayudar a otras personas con la misma duda.
              </p>
              <a
                href={site.issuesUrl}
                className="glass inline-flex min-h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold !text-ink !no-underline transition hover:-translate-y-0.5"
              >
                Abrir GitHub Issues <ExternalLink size={15} className="text-nexus" aria-hidden />
              </a>
            </>
          ),
        },
        {
          id: 'correo',
          title: 'Correo',
          content: (
            <>
              <p>Para asuntos que prefieras no tratar en público.</p>
              <RevealEmail />
            </>
          ),
        },
        {
          id: 'antes',
          title: 'Antes de escribir',
          content: (
            <ul>
              <li>Indica qué plantilla usas (el nombre o la dirección de su página) y tu versión de n8n.</li>
              <li>Cuenta qué esperabas que pasara y qué pasó, con el mensaje de error si lo hay.</li>
              <li>
                <strong>No compartas credenciales, tokens ni datos personales</strong>, ni en los Issues ni por correo. Si
                adjuntas un flujo exportado, revisa antes que no los contenga.
              </li>
            </ul>
          ),
        },
        {
          id: 'respuesta',
          title: 'Qué esperar',
          content: (
            <p>
              Moss Nexus es un proyecto personal y gratuito: respondo cuando puedo, sin un plazo garantizado. No ofrezco soporte
              técnico ni consultoría por estos canales, aunque las sugerencias sí ayudan a decidir qué plantillas publicar después.
            </p>
          ),
        },
      ]}
    />
  )
}
