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
          En resumen: Moss Nexus no tiene cuentas, formularios, cookies ni analítica, y no envía tus datos a ningún servidor
          propio, porque no tiene uno. Esta página explica con detalle lo poco que ocurre con tus datos al usar el sitio.
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
          title: 'Sin analítica ni recursos de terceros',
          content: (
            <p>
              El sitio no usa analítica, publicidad, píxeles de seguimiento, redes de distribución de contenido ni contenido
              incrustado de otros sitios. Las tipografías van incluidas en el propio sitio. Los enlaces a sitios externos, como
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
                Como el sitio no recopila datos personales, no hay información tuya guardada del lado de Moss Nexus que consultar,
                corregir o borrar.
              </p>
              <p>
                Si tienes dudas sobre esta política, usa los canales de la página de <Link to="/contacto">contacto</Link>. Si me
                escribes por GitHub o por correo, uso tus datos solo para responderte; esos mensajes quedan además sujetos a la
                política de privacidad de GitHub o de tu proveedor de correo.
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
