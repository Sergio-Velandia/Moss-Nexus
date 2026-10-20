// Luxon no trae tipos y solo se usa en las pruebas (devDependency): se declara lo mínimo que usa el arnés,
// en lugar de agregar @types/luxon como otra dependencia.
declare module 'luxon' {
  export interface LuxonDateTime {
    minus(duracion: { days: number }): LuxonDateTime
    diff(otra: LuxonDateTime, unidad: 'days'): { days: number }
    toFormat(formato: string): string
  }
  export const DateTime: { fromISO(texto: string): LuxonDateTime }
  export const Settings: { defaultZone: string }
}
