import { replaceEnv, replaceVars } from '@universal-packages/variable-replacer'
import fs from 'fs'
import path from 'path'

import { RenderResult, RendererInterface } from './Mailing.types'
import { ReplacerRendererOptions } from './ReplacerRenderer.types'

export default class ReplacerRenderer implements RendererInterface {
  public readonly options: ReplacerRendererOptions

  public constructor(options?: ReplacerRendererOptions) {
    this.options = { htmlExtension: 'html', textExtension: 'txt', ...options }
  }

  public render(location: string, locals: Record<string, any>): RenderResult {
    let html = this.processTemplate(location, this.options.htmlExtension, locals)
    let text = this.processTemplate(location, this.options.textExtension, locals)

    return { html, text }
  }

  private processTemplate(baseLocation: string, extension: string, locals: Record<string, any>): string {
    const templateLocation = `${baseLocation}.${extension}`

    if (fs.existsSync(templateLocation)) {
      const file = fs.readFileSync(templateLocation).toString()
      const layoutMatch = /^--(.*)\n/.exec(file)
      let finalContent = file

      if (layoutMatch) {
        const layoutLocation = `${path.dirname(templateLocation)}/${layoutMatch[1].trim()}.${extension}`
        finalContent = finalContent.replace(/^--.*\n/, '')

        if (fs.existsSync(layoutLocation)) {
          const layoutFile = fs.readFileSync(layoutLocation).toString()

          finalContent = replaceVars(layoutFile, { yield: finalContent })
        }
      }

      return replaceEnv(replaceVars(finalContent, locals))
    }
  }
}
