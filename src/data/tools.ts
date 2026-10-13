import {
  Bot,
  CalendarClock,
  ClipboardList,
  Contact,
  CreditCard,
  Clock,
  Database,
  FileText,
  GitBranch,
  Globe,
  HardDrive,
  Hash,
  Mail,
  MessageCircle,
  Send,
  Sheet,
  Webhook,
  type LucideIcon,
} from 'lucide-react'

/**
 * Catálogo de herramientas que pueden aparecer en una plantilla.
 * Íconos genéricos a propósito: Nexus no usa logos de marcas.
 * Para una herramienta nueva, añádela aquí y úsala por su id en meta.json y diagram.json.
 */
export interface Tool {
  id: string
  nombre: string
  icon: LucideIcon
  /** Tono del ícono en el mapa y los chips */
  color: string
  /** Candidata a «Herramientas populares» del Inicio (solo se muestra si tiene al menos una plantilla) */
  popular?: boolean
}

export const tools: Tool[] = [
  { id: 'whatsapp', nombre: 'WhatsApp', icon: MessageCircle, color: '#4fbf7a', popular: true },
  { id: 'gmail', nombre: 'Gmail', icon: Mail, color: '#e8745f', popular: true },
  { id: 'google-sheets', nombre: 'Google Sheets', icon: Sheet, color: '#3fae6a', popular: true },
  { id: 'slack', nombre: 'Slack', icon: Hash, color: '#c17bd0', popular: true },
  { id: 'telegram', nombre: 'Telegram', icon: Send, color: '#4aa8e0', popular: true },
  { id: 'google-calendar', nombre: 'Google Calendar', icon: CalendarClock, color: '#5b8def', popular: true },
  { id: 'notion', nombre: 'Notion', icon: FileText, color: '#b9b4a8', popular: true },
  { id: 'openai', nombre: 'IA (OpenAI)', icon: Bot, color: '#5fc4b0', popular: true },
  { id: 'webhook', nombre: 'Webhook', icon: Webhook, color: '#f2647a', popular: true },
  { id: 'form', nombre: 'Formulario de n8n', icon: ClipboardList, color: '#e0a458', popular: true },
  { id: 'google-drive', nombre: 'Google Drive', icon: HardDrive, color: '#f4b942', popular: true },
  { id: 'hubspot', nombre: 'HubSpot', icon: Contact, color: '#ff7a59', popular: true },
  { id: 'stripe', nombre: 'Stripe', icon: CreditCard, color: '#8f84f5', popular: true },
  { id: 'http', nombre: 'Petición HTTP', icon: Globe, color: '#7aa2d6' },
  { id: 'schedule', nombre: 'Programación', icon: Clock, color: '#e0a458' },
  { id: 'n8n', nombre: 'Lógica de n8n', icon: GitBranch, color: '#f2647a' },
  { id: 'database', nombre: 'Base de datos', icon: Database, color: '#9b8fd6' },
]

const byId = new Map(tools.map((t) => [t.id, t]))

export const getTool = (id: string): Tool | undefined => byId.get(id)
export const hasTool = (id: string) => byId.has(id)
