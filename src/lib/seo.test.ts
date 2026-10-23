import { describe, expect, it } from 'vitest'
import html from '../../index.html?raw'
import ogDataUrl from '../../public/og.png?inline'
const meta = (prop: string) => html.match(new RegExp(`<meta (?:property|name)="${prop}" content="([^"]+)"`))?.[1]

describe('vista previa al compartir', () => {
  it('og:image apunta a public/og.png y el archivo existe con el tamaño declarado', () => {
    expect(meta('og:image')).toBe('https://sergio-velandia.dev/Moss-Nexus/og.png')
    expect(meta('twitter:image')).toBe(meta('og:image'))
    const bin = atob(ogDataUrl.split(',')[1])
    const png = new DataView(Uint8Array.from(bin, (c) => c.charCodeAt(0)).buffer)
    // Cabecera PNG: ancho y alto en los bytes 16 a 23 del bloque IHDR
    expect(bin.slice(1, 4)).toBe('PNG')
    expect([png.getUint32(16), png.getUint32(20)]).toEqual([Number(meta('og:image:width')), Number(meta('og:image:height'))])
  })

  it('canonical y og:url usan el dominio del sitio', () => {
    expect(html).toContain('<link rel="canonical" href="https://sergio-velandia.dev/Moss-Nexus/" />')
    expect(meta('og:url')).toBe('https://sergio-velandia.dev/Moss-Nexus/')
  })
})
