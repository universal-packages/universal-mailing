export type SendFunction = (options: SendOptions) => Promise<void>

export interface MailingOptions {
  engine?: string | EngineInterface
  engineOptions?: Record<string, any>
  renderer?: string | RendererInterface
  rendererOptions?: Record<string, any>
  templatesLocation?: string
}

export interface SendOptions {
  bcc?: string | string[]
  cc?: string | string[]
  extra?: Record<string, any>
  from?: string
  html?: string
  locale?: string
  locals?: Record<string, any>
  sender?: string
  subject?: string
  template?: string
  text?: string
  to?: string | string[]
}

export interface EngineInterface {
  send: (options: SendOptions) => void | Promise<void>
}

export interface RendererInterface {
  render: (location: string, locals: Record<string, any>) => RenderResult | Promise<RenderResult>
}

export interface EngineInterfaceClass {
  new (...args: any[]): EngineInterface
}

export interface RendererInterfaceClass {
  new (...args: any[]): RendererInterface
}

export interface RenderResult {
  html: string
  text: string
}
