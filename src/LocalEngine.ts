import crypto from 'crypto'
import fs from 'fs'
import open from 'open'
import path from 'path'

import { LocalEngineOptions } from './LocalEngine.types'
import { EngineInterface, SendOptions } from './Mailing.types'

export default class LocalEngine implements EngineInterface {
  public readonly options: LocalEngineOptions

  public constructor(options?: LocalEngineOptions) {
    this.options = { saveLocation: '/tmp', ...options }
  }

  public async send(options: SendOptions): Promise<void> {
    const hash = crypto
      .createHmac('sha256', Date.now().toString())
      .update(`${JSON.stringify(options)}`)
      .digest('hex')
    const fileName = `mail.${hash}.html`
    const saveLocation = path.join(this.options.saveLocation, fileName)
    fs.writeFileSync(saveLocation, Buffer.from(this.buildFrame(hash, saveLocation, options)))

    await open(saveLocation)
  }

  private buildFrame(id: string, location: string, options: SendOptions): string {
    return `
    <html>
      <head>
        <style>
          h1 { margin: 0 0 10px 0; }
          iframe { border: none; }
          h2 { border-bottom: 2px gray solid; }
          .top { border-bottom: 2px gray solid; padding: 10px; }
          .info { display: flex; flex-direction: row; }
          .info > p { margin-right: 20px; }
          body { margin: 0 }
        </style>
      </head>
      <body>
        <div class="top">
          <h1>Local Email</h1>
          <div class="info">
            <p><b>id:</b> ${id}</p>
            <p><b>at:</b> ${location}</p>
          </div>
          <div class="email">
            <p><b>subject:</b> ${options.subject}</p>
            <p><b>from:</b> ${options.from || ''}</p>
            <p><b>to:</b> ${options.to || ''}</p>
            ${options.cc ? `<p><b>cc:</b> ${options.cc}</p>` : ''}
            ${options.bcc ? `<p><b>bcc:</b> ${options.bcc}</p>` : ''}
          </div>
        </div>
        <div>
          ${options.html ? `<h2>html:</h2><iframe srcdoc="${options.html}"></iframe>` : ''}
        </div>
        <div>
          ${options.text ? `<h2>text:</h2><div>${options.text}</div>` : ''}
        </div>
      </body>
    </html>
    `
  }
}
