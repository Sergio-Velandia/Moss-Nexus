import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { Plugin } from 'vite'

/**
 * GitHub Pages no conoce las rutas de React Router: sin esto, /plantillas responde 404 (aunque 404.html cargue la app)
 * y los buscadores no la indexan. Tras el build se crea un index.html por ruta, con su título, descripción y URL
 * propios, para que respondan 200 y se vean bien al compartirlas. También se genera sitemap.xml.
 */

export const SITE_URL = 'https://sergio-velandia.dev/Moss-Nexus/'

export interface StaticPage {
  /** Ruta relativa al sitio, con barra final (así la sirve GitHub Pages) */
  path: string
  title: string
  description: string
}

const pagina = (titulo: string) => `${titulo} · Moss Nexus`

export const STATIC_PAGES: StaticPage[] = [
  {
    path: 'plantillas/',
    title: pagina('Plantillas'),
    description: 'Galería de plantillas de n8n listas para copiar: busca y filtra por herramienta, categoría o nivel.',
  },
  { path: 'acerca/', title: pagina('Acerca'), description: 'Qué es Moss Nexus, cómo se relaciona con Moss y los principios de la librería.' },
  { path: 'terminos/', title: pagina('Términos y condiciones'), description: 'Términos de uso de Moss Nexus y de sus plantillas.' },
  { path: 'privacidad/', title: pagina('Política de privacidad'), description: 'Qué hace Moss Nexus con tus datos: sin cuentas, cookies ni analítica.' },
  { path: 'contacto/', title: pagina('Contacto'), description: 'Cómo contactar a Moss Nexus: GitHub Issues y correo.' },
]

/** Una página por plantilla, a partir de su meta.json */
export function templatePages(templatesDir: string): StaticPage[] {
  return readdirSync(templatesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => JSON.parse(readFileSync(join(templatesDir, d.name, 'meta.json'), 'utf8')) as { slug: string; titulo: string; resumen: string })
    .map((m) => ({ path: `plantillas/${m.slug}/`, title: pagina(m.titulo), description: m.resumen }))
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Copia el index.html del build cambiando título, descripción, Open Graph y URL canónica */
export function pageHtml(baseHtml: string, page: StaticPage): string {
  const url = SITE_URL + page.path
  const title = esc(page.title)
  const description = esc(page.description)
  const swaps: [RegExp, string][] = [
    [/<title>[^<]*<\/title>/, `<title>${title}</title>`],
    [/(<meta name="description" content=")[^"]*/, `$1${description}`],
    [/(<link rel="canonical" href=")[^"]*/, `$1${url}`],
    [/(<meta property="og:title" content=")[^"]*/, `$1${title}`],
    [/(<meta property="og:description" content=")[^"]*/, `$1${description}`],
    [/(<meta property="og:url" content=")[^"]*/, `$1${url}`],
    [/(<meta name="twitter:title" content=")[^"]*/, `$1${title}`],
    [/(<meta name="twitter:description" content=")[^"]*/, `$1${description}`],
  ]
  return swaps.reduce((html, [pattern, value]) => {
    if (!pattern.test(html)) throw new Error(`static-pages: no se encontró ${pattern} en index.html`)
    return html.replace(pattern, value)
  }, baseHtml)
}

export function sitemapXml(pages: StaticPage[]): string {
  const urls = ['', ...pages.map((p) => p.path)].map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

export function staticPages(): Plugin {
  let outDir = 'dist'
  let root = process.cwd()
  return {
    name: 'moss-nexus-static-pages',
    apply: 'build',
    configResolved(config) {
      root = config.root
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const baseHtml = readFileSync(join(outDir, 'index.html'), 'utf8')
      const pages = [...STATIC_PAGES, ...templatePages(join(root, 'src/data/templates'))]
      for (const page of pages) {
        const dir = join(outDir, page.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), pageHtml(baseHtml, page))
      }
      writeFileSync(join(outDir, 'sitemap.xml'), sitemapXml(pages))
    },
  }
}
