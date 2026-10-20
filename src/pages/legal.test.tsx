import { describe, expect, it } from 'vitest'
import { prerender } from 'react-dom/static'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../App'

/** Renderiza una ruta real del sitio en el servidor, esperando a que carguen las páginas diferidas */
async function renderRoute(path: string) {
  const { prelude } = await prerender(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>,
  )
  return new Response(prelude).text()
}

const h1s = (html: string) => [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''))

describe('páginas legales', () => {
  it.each([
    ['/terminos', 'Términos y condiciones'],
    ['/privacidad', 'Política de privacidad'],
    ['/contacto', 'Contacto'],
  ])('%s renderiza con un único h1 y fecha de actualización', async (path, title) => {
    const html = await renderRoute(path)
    expect(h1s(html)).toEqual([title])
    expect(html).toMatch(/Última actualización: <time dateTime="\d{4}-\d{2}-\d{2}"/)
  })

  it('términos incluye la licencia (destino del footer) y la ley aplicable', async () => {
    const html = await renderRoute('/terminos')
    expect(html).toContain('id="licencia"')
    expect(html).toContain('id="ley-aplicable"')
    expect(html).toContain('República de Colombia')
  })

  it('contacto enlaza a GitHub Issues y no expone el correo en el HTML', async () => {
    const html = await renderRoute('/contacto')
    expect(html).toContain('https://github.com/Sergio-Velandia/Moss-Nexus/issues')
    expect(html).not.toMatch(/@gmail\.com|@sergio-velandia\.dev|mailto:/)
  })
})

describe('propón un flujo', () => {
  it('muestra las dos pestañas y por defecto el formulario de propuesta', async () => {
    const html = await renderRoute('/propon-un-flujo')
    expect(h1s(html)).toHaveLength(1)
    expect(html).toContain('role="tablist"')
    expect(html.match(/role="tab"/g)).toHaveLength(2)
    expect(html).toContain('aria-label="Propón un flujo"')
    expect(html).toContain('name="problema"')
    expect(html).toContain('href="/privacidad#formularios"')
  })

  it('?formulario=habla-conmigo abre el formulario corto', async () => {
    const html = await renderRoute('/propon-un-flujo?formulario=habla-conmigo')
    expect(html).toContain('aria-label="Habla conmigo"')
    expect(html).toContain('name="mensaje"')
    expect(html).not.toContain('name="problema"')
  })

  it('no expone ningún correo en el HTML', async () => {
    const html = await renderRoute('/propon-un-flujo')
    expect(html).not.toMatch(/@gmail\.com|@sergio-velandia\.dev|mailto:/)
  })

  it('privacidad describe el formulario y el servicio que lo envía', async () => {
    const html = await renderRoute('/privacidad')
    expect(html).toContain('id="formularios"')
    expect(html).toContain('EmailJS')
    expect(html).toContain('Ley 1581 de 2012')
  })
})

describe('footer', () => {
  it('enlaza a términos, privacidad, contacto y licencia, con el aviso de n8n y el año', async () => {
    const html = await renderRoute('/')
    for (const href of ['/terminos', '/privacidad', '/contacto', '/terminos#licencia']) {
      expect(html).toContain(`href="${href}"`)
    }
    expect(html).toContain('sin relación oficial con n8n GmbH')
    expect(html).toContain(`© <!-- -->${new Date().getFullYear()}`)
  })
})
