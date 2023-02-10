import open from 'open'
import fs from 'fs'
import { LocalEngine } from '../src'

const writeFileSync = jest.spyOn(fs, 'writeFileSync').mockImplementation()

describe('LocalMailer', (): void => {
  it('writes the right content into a file and opens it', async (): Promise<void> => {
    const engine = new LocalEngine()

    await engine.send({ subject: 'Welcome', html: 'html-content', text: 'text-content' })

    expect(writeFileSync).toBeCalledWith(expect.stringMatching(/\/tmp\/mail.*.html/), expect.any(Buffer))
    expect(open).toHaveBeenCalledWith(expect.stringMatching(/\/tmp\/mail.*.html/))
  })
})
