import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { pageHtml, SITE_URL, sitemapXml, STATIC_PAGES, templatePages } from './static-pages.ts'

const indexHtml = readFileSync('index.html', 'utf8')
const page = { path: 'plantillas/demo/', title: 'Demo "con comillas" · Moss Nexus', description: 'Resumen <corto> & claro' }

describe('páginas estáticas por ruta', () => {
  it('cambia título, descripción, canonical, Open Graph y Twitter', () => {
    const html = pageHtml(indexHtml, page)
    const url = `${SITE_URL}plantillas/demo/`
    expect(html).toContain('<title>Demo &quot;con comillas&quot; · Moss Nexus</title>')
    expect(html).toContain('<meta name="description" content="Resumen &lt;corto&gt; &amp; claro"')
    expect(html).toContain(`<link rel="canonical" href="${url}"`)
    expect(html).toContain(`<meta property="og:url" content="${url}"`)
    expect(html).toContain('<meta property="og:title" content="Demo &quot;con comillas&quot; · Moss Nexus"')
    expect(html).toContain('<meta name="twitter:description" content="Resumen &lt;corto&gt; &amp; claro"')
  })
  it('conserva la imagen para compartir y el script del tema', () => {
    const html = pageHtml(indexHtml, page)
    expect(html).toContain(`${SITE_URL}og.png`)
    expect(html).toContain("localStorage.getItem('nexus-theme')")
  })
  it('falla de forma clara si index.html pierde una etiqueta esperada', () => {
    expect(() => pageHtml('<html></html>', page)).toThrow(/static-pages/)
  })
  it('crea una página por plantilla y el sitemap las incluye todas', () => {
    const plantillas = templatePages('src/data/templates')
    expect(plantillas.length).toBeGreaterThan(0)
    const xml = sitemapXml([...STATIC_PAGES, ...plantillas])
    expect(xml.match(/<loc>/g)).toHaveLength(1 + STATIC_PAGES.length + plantillas.length)
    expect(xml).toContain(`<loc>${SITE_URL}plantillas/whatsapp-a-sheets/</loc>`)
  })
})
