import fs from 'fs'
import open from 'open'

import { LocalEngine } from '../src'

const writeFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation()

describe(LocalEngine, (): void => {
  it('writes the right content into a file and opens it', async (): Promise<void> => {
    const engine = new LocalEngine()

    await engine.send({ subject: 'Welcome', html: 'html-content', text: 'text-content' })

    expect(writeFileSync).toHaveBeenCalledWith(expect.stringMatching(/\/tmp\/mail.*.html/), expect.any(String))
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/\/tmp\/mail.*.html/))
  })
})
