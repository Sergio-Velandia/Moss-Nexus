/** Categorías de la galería. Para una nueva, añádela aquí y úsala por su id en meta.json. */
export interface Category {
  id: string
  nombre: string
}

export const categories: Category[] = [
  { id: 'ventas', nombre: 'Ventas y CRM' },
  { id: 'atencion', nombre: 'Atención al cliente' },
  { id: 'productividad', nombre: 'Productividad' },
  { id: 'reportes', nombre: 'Reportes y datos' },
  { id: 'marketing', nombre: 'Marketing' },
  { id: 'finanzas', nombre: 'Finanzas' },
  { id: 'operaciones', nombre: 'Operaciones y TI' },
  { id: 'rrhh', nombre: 'Recursos humanos' },
]

const byId = new Map(categories.map((c) => [c.id, c]))

export const getCategory = (id: string) => byId.get(id)
export const hasCategory = (id: string) => byId.has(id)
