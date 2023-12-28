import { LocalEngine, Mailing, ReplacerRenderer, TestEngine } from '../src'

TestEngine.mock = jest.fn()

beforeEach((): void => {
  TestEngine.mock.mockClear()
})

describe(Mailing, (): void => {
  it('It uses default renderer and engine to send an email', async (): Promise<void> => {
    const mailer = new Mailing({ templatesLocation: './tests/__fixtures__' })
    const listener = jest.fn()

    mailer.on('*:*', listener)

    await mailer.prepare()

    await mailer.send({ subject: 'Welcome', template: 'welcome-email', locals: { local: '123' } })

    expect(TestEngine.mock).toHaveBeenCalled()
    expect(TestEngine.mock).toHaveBeenCalledWith({
      template: 'tests/__fixtures__/welcome-email',
      subject: 'Welcome',
      locals: { local: '123' },
      html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
      text: 'This is a test email 123\n'
    })
    expect(listener.mock.calls).toEqual([
      [
        {
          event: 'send:start',
          payload: {
            subject: 'Welcome',
            template: 'welcome-email',
            locals: {
              local: '123'
            }
          }
        }
      ],
      [
        {
          event: 'send:end',
          payload: {
            subject: 'Welcome',
            template: 'tests/__fixtures__/welcome-email',
            locals: {
              local: '123'
            },
            html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
            text: 'This is a test email 123\n'
          }
        }
      ]
    ])
  })

  it('appends locale to template path', async (): Promise<void> => {
    const mailer = new Mailing({ templatesLocation: './tests/__fixtures__' })
    const listener = jest.fn()

    mailer.on('*:*', listener)

    await mailer.prepare()

    await mailer.send({ subject: 'Welcome', template: 'welcome-email', locale: 'es', locals: { local: '123' } })

    expect(TestEngine.mock).toHaveBeenCalledWith({
      template: 'tests/__fixtures__/welcome-email.es',
      subject: 'Welcome',
      locale: 'es',
      locals: { local: '123' },
      html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
      text: 'This is a test email 123\n'
    })

    await mailer.send({ subject: 'Welcome', template: 'welcome-email', locale: 'en', locals: { local: '123' } })

    expect(TestEngine.mock).toHaveBeenCalledWith({
      template: 'tests/__fixtures__/welcome-email.en',
      subject: 'Welcome',
      locale: 'en',
      locals: { local: '123' },
      html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
      text: 'This is a test email 123\n'
    })
    expect(listener.mock.calls).toEqual([
      [
        {
          event: 'send:start',
          payload: {
            subject: 'Welcome',
            template: 'welcome-email',
            locale: 'es',
            locals: {
              local: '123'
            }
          }
        }
      ],
      [
        {
          event: 'send:end',
          payload: {
            subject: 'Welcome',
            template: 'tests/__fixtures__/welcome-email.es',
            locale: 'es',
            locals: {
              local: '123'
            },
            html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
            text: 'This is a test email 123\n'
          }
        }
      ],
      [
        {
          event: 'send:start',
          payload: {
            subject: 'Welcome',
            template: 'welcome-email',
            locale: 'en',
            locals: {
              local: '123'
            }
          }
        }
      ],
      [
        {
          event: 'send:end',
          payload: {
            subject: 'Welcome',
            template: 'tests/__fixtures__/welcome-email.en',
            locale: 'en',
            locals: {
              local: '123'
            },
            html: '<html>\n  <body>\n    <p>\n  This is a test email 123\n</p>\n\n  </body>\n</html>\n',
            text: 'This is a test email 123\n'
          }
        }
      ]
    ])
  })

  it('Sets adapters from string', async (): Promise<void> => {
    const mailer = new Mailing({ templatesLocation: './tests/__fixtures__', engine: 'local', renderer: 'replacer' })
    await mailer.prepare()

    expect(mailer).toMatchObject({ engine: expect.any(LocalEngine), renderer: expect.any(ReplacerRenderer) })
  })

  it('Sets adapters from objects', async (): Promise<void> => {
    const engine = new TestEngine()
    const renderer = new ReplacerRenderer()
    const mailer = new Mailing({ templatesLocation: './tests/__fixtures__', engine, renderer })
    await mailer.prepare()

    expect(mailer).toMatchObject({ engine, renderer })
  })
})
