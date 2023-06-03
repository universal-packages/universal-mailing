import { resolveAdapter } from '@universal-packages/adapter-resolver'
import path from 'path'

import LocalEngine from './LocalEngine'
import { EngineInterface, EngineInterfaceClass, MailingOptions, RendererInterface, RendererInterfaceClass, SendOptions } from './Mailing.types'
import ReplacerRenderer from './ReplacerRenderer'
import TestEngine from './TestEngine'

export default class Mailing {
  public readonly options: MailingOptions

  private engine: EngineInterface
  private renderer: RendererInterface

  public constructor(options?: MailingOptions) {
    this.options = {
      templatesLocation: './src',
      engine: process.env['NODE_ENV'] === 'test' ? 'test' : 'local',
      renderer: 'replacer',
      ...options
    }
  }

  public async prepare(): Promise<void> {
    await this.setEngine()
    await this.setRenderer()
  }

  public async send(options: SendOptions): Promise<void> {
    let finalOptions = options

    if (options.template) {
      const templatePath = path.isAbsolute(options.template) ? options.template : path.join(this.options.templatesLocation, options.template)
      const templatePathWithLocale = options.locale ? `${templatePath}.${options.locale}` : templatePath
      const renderResult = await this.renderer.render(templatePathWithLocale, options.locals)

      finalOptions = { ...finalOptions, template: templatePathWithLocale, ...renderResult }
    }

    await this.engine.send(finalOptions)
  }

  private async setEngine(): Promise<void> {
    if (typeof this.options.engine === 'string') {
      const AdapterModule = await resolveAdapter<EngineInterfaceClass>(this.options.engine, {
        domain: 'mailing',
        type: 'engine',
        internal: { test: TestEngine, local: LocalEngine }
      })
      this.engine = new AdapterModule(this.options.engineOptions)
    } else {
      this.engine = this.options.engine
    }
  }

  private async setRenderer(): Promise<void> {
    if (typeof this.options.renderer === 'string') {
      const AdapterModule = await resolveAdapter<RendererInterfaceClass>(this.options.renderer, { domain: 'mailing', type: 'renderer', internal: { replacer: ReplacerRenderer } })
      this.renderer = new AdapterModule(this, this.options.rendererOptions)
    } else {
      this.renderer = this.options.renderer
    }
  }
}
