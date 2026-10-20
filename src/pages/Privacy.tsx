import { Link } from 'react-router-dom'
import { LegalPage } from '../components/legal/LegalPage'
import { site } from '../data/site'

export default function Privacy() {
  return (
    <LegalPage
      title="Política de privacidad"
      updated={site.legalUpdated}
      intro={
        <p>
          En resumen: Moss Nexus no tiene cuentas, cookies ni analítica, ni un servidor propio. Lo único que envía datos
          personales es el formulario de <Link to="/propon-un-flujo">Propón un flujo</Link>, y solo cuando tú lo envías. Esta
          página explica con detalle qué ocurre con tus datos al usar el sitio.
        </p>
      }
      sections={[
        {
          id: 'navegador',
          title: 'Qué se guarda en tu navegador',
          content: (
            <>
              <p>
                Solo una preferencia: si cambias entre el tema oscuro y el claro, el sitio guarda tu elección en el
                almacenamiento local del navegador (<code>localStorage</code>), con la clave <code>nexus-theme</code> y el valor{' '}
                <code>light</code> o <code>dark</code>. Sirve para que el sitio recuerde el tema la próxima vez. Nunca sale de tu
                navegador.
              </p>
              <p>
                No se usan cookies ni ningún otro almacenamiento. Puedes borrar esa preferencia cuando quieras eliminando los datos
                del sitio desde la configuración de tu navegador.
              </p>
            </>
          ),
        },
        {
          id: 'busqueda',
          title: 'Búsqueda y filtros',
          content: (
            <p>
              La búsqueda y los filtros de la galería se procesan en tu navegador: no se envían a ningún servicio de búsqueda.
              Quedan en la dirección de la página (por ejemplo <code>?q=correo</code>) para que puedas compartirla o volver atrás.
              Si recargas o abres esa dirección, el texto forma parte de la dirección que tu navegador pide al servidor que aloja
              el sitio, como ocurre con cualquier página web.
            </p>
          ),
        },
        {
          id: 'portapapeles',
          title: 'Portapapeles y descargas',
          content: (
            <p>
              El botón «Copiar flujo» escribe en tu portapapeles el JSON de la plantilla, y solo cuando lo pulsas. El sitio nunca
              lee tu portapapeles. «Descargar .json» genera el archivo directamente en tu navegador, sin pasar por ningún servidor.
            </p>
          ),
        },
        {
          id: 'formularios',
          title: 'El formulario «Propón un flujo»',
          content: (
            <>
              <p>
                <strong>Qué datos:</strong> tu nombre, tu correo y lo que escribas en el formulario. En «Propón un flujo» son,
                además, el negocio, el sector, el tamaño del equipo, el problema, cómo lo resuelves hoy, tu idea, las
                herramientas, la frecuencia, qué buscas y si aceptas que la idea se publique como plantilla. En «Habla conmigo»,
                el asunto y el mensaje. Los campos marcados como opcionales puedes dejarlos vacíos.
              </p>
              <p>
                <strong>Para qué:</strong> para responderte y dar seguimiento a lo que me propones. Solo si marcas la casilla
                correspondiente, la idea (no tus datos ni los de tu negocio) puede convertirse en una plantilla pública. No uso
                estos datos para publicidad, no los vendo y no los comparto con nadie más.
              </p>
              <p>
                <strong>Cómo viajan:</strong> al pulsar «Enviar», tu navegador manda el contenido del formulario al servicio{' '}
                <a href="https://www.emailjs.com/legal/privacy-policy/">EmailJS</a>, que lo convierte en un correo y lo entrega
                en el buzón de Moss Nexus. EmailJS trata esos datos y los datos técnicos de la conexión (como la dirección IP)
                según su política de privacidad, y puede hacerlo en servidores fuera de Colombia. Antes de pulsar «Enviar», nada
                sale de tu navegador.
              </p>
              <p>
                <strong>Cuánto tiempo:</strong> conservo el mensaje mientras sea necesario para responderte y dar seguimiento a
                tu propuesta. Puedes pedirme que lo borre cuando quieras.
              </p>
              <p>
                El formulario no usa cookies ni guarda nada en tu navegador. Incluye un campo oculto para frenar a los bots: si
                llega con texto, el mensaje se descarta.
              </p>
            </>
          ),
        },
        {
          id: 'alojamiento',
          title: 'Alojamiento del sitio',
          content: (
            <p>
              El sitio se sirve desde GitHub Pages, un servicio de GitHub. Como cualquier servidor web, GitHub puede registrar datos
              técnicos de cada conexión, como la dirección IP, el navegador y la página solicitada, para operar y proteger su
              servicio. Ese tratamiento lo hace GitHub según su{' '}
              <a href="https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement">
                declaración de privacidad
              </a>
              ; Moss Nexus no tiene acceso a esos registros.
            </p>
          ),
        },
        {
          id: 'terceros',
          title: 'Sin analítica ni rastreo',
          content: (
            <p>
              El sitio no usa analítica, publicidad, píxeles de seguimiento, redes de distribución de contenido ni contenido
              incrustado de otros sitios. El único servicio de terceros es EmailJS, y solo se contacta cuando envías el
              formulario. Las tipografías van incluidas en el propio sitio. Los enlaces a sitios externos, como
              Moss o GitHub, se rigen por la política de privacidad de cada uno cuando los visitas.
            </p>
          ),
        },
        {
          id: 'plantillas',
          title: 'Las plantillas y los datos que procesan',
          content: (
            <p>
              Los flujos que copias se ejecutan en tu propia instancia de n8n, con tus credenciales. Moss Nexus no recibe, ve ni
              guarda los datos que esos flujos procesan. Si un flujo maneja datos personales de otras personas (clientes,
              empleados, contactos), tú decides cómo se tratan y eres responsable de cumplir la ley que te aplique.
            </p>
          ),
        },
        {
          id: 'derechos',
          title: 'Tus derechos y cómo contactarme',
          content: (
            <>
              <p>
                El responsable del tratamiento de los datos que envías por el formulario o por correo es {site.author}, autor de
                Moss Nexus, en Colombia. Según la Ley 1581 de 2012, puedes conocer, actualizar y rectificar tus datos, pedir prueba
                de tu autorización, saber cómo se han usado, revocar la autorización o pedir que los borre, y presentar quejas
                ante la Superintendencia de Industria y Comercio.
              </p>
              <p>
                Para ejercer esos derechos o resolver dudas sobre esta política, escríbeme por los canales de la página de{' '}
                <Link to="/contacto">contacto</Link>. Respondo las consultas en un máximo de 10 días hábiles y los reclamos en un
                máximo de 15, como fija la ley. Si me escribes por GitHub, ese mensaje queda además sujeto a la política de
                privacidad de GitHub.
              </p>
            </>
          ),
        },
        {
          id: 'cambios',
          title: 'Cambios en esta política',
          content: (
            <p>
              Si el sitio cambia la forma en que trata los datos, por ejemplo si algún día incorpora analítica, esta página se
              actualizará antes y mostrará la nueva fecha de última actualización.
            </p>
          ),
        },
      ]}
    />
  )
}
