import { Link } from 'react-router-dom'
import { LegalPage } from '../components/legal/LegalPage'
import { site } from '../data/site'

const file = (name: string) => `${site.repoUrl}/blob/main/${name}`

export default function Terms() {
  return (
    <LegalPage
      title="Términos y condiciones"
      updated={site.legalUpdated}
      intro={
        <p>
          Estos términos explican cómo puedes usar Moss Nexus y sus plantillas. Al navegar por el sitio o copiar un flujo, los
          aceptas. Son cortos a propósito: si algo no queda claro, <Link to="/contacto">escríbeme</Link>.
        </p>
      }
      sections={[
        {
          id: 'que-es',
          title: 'Qué es Moss Nexus',
          content: (
            <p>
              Moss Nexus es un sitio informativo, gratuito y personal, mantenido por {site.author} como parte del ecosistema
              Moss. Publica plantillas de flujos para n8n con explicaciones en español. No vende productos ni servicios, no
              tiene cuentas de usuario y no ejecuta ningún flujo por ti.
            </p>
          ),
        },
        {
          id: 'plantillas',
          title: 'Uso de las plantillas',
          content: (
            <>
              <p>
                Las plantillas se entregan <strong>«tal cual»</strong>, sin garantía de ningún tipo, ni expresa ni implícita,
                incluida la de que funcionen en tu caso o sirvan para un fin concreto.
              </p>
              <ul>
                <li>
                  Cada plantilla es un punto de partida. Casi siempre necesitará ajustes según tus datos, tus herramientas y las
                  reglas de tu negocio.
                </li>
                <li>
                  Antes de usar un flujo con datos o dinero reales, revísalo nodo por nodo y pruébalo en un entorno de prueba.
                </li>
                <li>
                  Las plantillas marcadas «Sin probar» no se han ejecutado en una instancia real de n8n. El sello «Probado»
                  indica que el flujo funcionó en una prueba concreta, con la fecha y la versión de n8n que muestra; no garantiza
                  que funcione con otras versiones ni en tu configuración.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'credenciales',
          title: 'Tus credenciales, tus datos y servicios de terceros',
          content: (
            <>
              <p>
                Las plantillas no incluyen credenciales. Tú configuras las tuyas en tu propia instancia de n8n y eres responsable
                de protegerlas.
              </p>
              <p>
                Los flujos se conectan con servicios de terceros (por ejemplo WhatsApp, Google, Slack, Stripe u OpenAI). Al
                usarlos, aceptas los términos y las políticas de cada servicio, y eres responsable de cumplirlos, incluidos sus
                límites de uso y sus costos. Si un flujo procesa datos personales de otras personas, también eres responsable de
                cumplir las leyes de protección de datos que te apliquen.
              </p>
            </>
          ),
        },
        {
          id: 'marcas',
          title: 'Marcas',
          content: (
            <p>
              Moss Nexus es un proyecto independiente. No está afiliado, patrocinado ni respaldado por n8n GmbH, Meta (WhatsApp),
              Google (Gmail, Google Sheets, Google Drive, Google Calendar), Slack, Telegram, HubSpot, Stripe, OpenAI ni ninguna
              otra empresa mencionada. Sus nombres y marcas pertenecen a sus respectivos dueños y se usan solo para indicar con
              qué herramientas funciona cada flujo. El sitio usa íconos genéricos, no logotipos de marcas.
            </p>
          ),
        },
        {
          id: 'responsabilidad',
          title: 'Limitación de responsabilidad',
          content: (
            <p>
              En la máxima medida que permita la ley aplicable, el autor no será responsable de ningún daño derivado del uso de
              este sitio o de sus plantillas, como pérdida de datos, mensajes o correos enviados por error, cobros, interrupciones
              de servicio o decisiones tomadas a partir de un flujo. Usas las plantillas bajo tu propio riesgo.
            </p>
          ),
        },
        {
          id: 'licencia',
          title: 'Licencia',
          content: (
            <>
              <p>El proyecto es abierto y usa tres licencias, según el tipo de material:</p>
              <ul>
                <li>
                  <strong>Flujos</strong> (archivos <code>workflow.json</code>, lo que copia el botón «Copiar flujo»):{' '}
                  <a href={file('LICENSE-WORKFLOWS')}>MIT-0</a>. Puedes copiarlos, modificarlos y usarlos, también con fines
                  comerciales, sin ninguna condición, ni siquiera citar la fuente.
                </li>
                <li>
                  <strong>Textos de las plantillas</strong> (explicaciones, requisitos, escenarios, pasos y diagramas):{' '}
                  <a href={file('LICENSE-CONTENT')}>CC BY 4.0</a>. Puedes reutilizarlos y adaptarlos, siempre que cites a Moss
                  Nexus como fuente.
                </li>
                <li>
                  <strong>Código del sitio</strong>: <a href={file('LICENSE')}>MIT</a>.
                </li>
              </ul>
            </>
          ),
        },
        {
          id: 'enlaces',
          title: 'Enlaces a otros sitios',
          content: (
            <p>
              El sitio enlaza a páginas externas, como Moss, GitHub o la documentación de otros servicios. No controlo su
              contenido ni sus políticas, que se rigen por sus propios términos.
            </p>
          ),
        },
        {
          id: 'cambios',
          title: 'Cambios en estos términos',
          content: (
            <p>
              Puedo actualizar estos términos. Cualquier cambio se publica en esta página con una nueva fecha de última
              actualización, y el historial completo queda en el repositorio público. Si sigues usando el sitio después de un
              cambio, se entiende que aceptas la nueva versión.
            </p>
          ),
        },
        {
          id: 'contacto',
          title: 'Contacto',
          content: (
            <p>
              Para dudas sobre estos términos, usa los canales de la página de <Link to="/contacto">contacto</Link>.
            </p>
          ),
        },
      ]}
    />
  )
}
