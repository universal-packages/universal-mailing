# Mailing

[![npm version](https://badge.fury.io/js/@universal-packages%2Fmailing.svg)](https://www.npmjs.com/package/@universal-packages/mailing)
[![Testing](https://github.com/universal-packages/universal-mailing/actions/workflows/testing.yml/badge.svg)](https://github.com/universal-packages/universal-mailing/actions/workflows/testing.yml)
[![codecov](https://codecov.io/gh/universal-packages/universal-mailing/branch/main/graph/badge.svg?token=CXPJSN8IGL)](https://codecov.io/gh/universal-packages/universal-mailing)

Mailing basics with modularity.

## Install

```shell
npm install @universal-packages/mailing
```

## Mailing

Mailing is the main interface for email sending, it uses an email engine and renderer to general email contents and send them over the internet.

```js
import { Mailing } from '@universal-packages/mailing'
import { NodemailerEngine } from '@universal-packages/mailing-nodemailer'

const mailing = new Mailing( engine: 'nodemailer', engineOptions: { transport: 'smtp', options: { host: 'smtp.com'} })

await mailing.prepare()

mailing.send({ subject: 'Email', from: 'universal@dev.com', to: 'david@packages.com', template: 'templates/email', locals: { name: 'Omar' } })
```

### Options

- **`engine`** `string | EngineInterface` `Default: local | test`
  Engine to use to send the email, by default if NODE_ENV is development local will be used, if NODE_ENV is test the the test engine will be used.
- **`engineOptions`** `Object`
  Any options that the engine constructor accepts
- **`renderer`** `string | EngineInterface` `Default: replacer`
  When specifying template when sending an email Mailing will use the renderer to use a template file.
- **`rendererOptions`** `Object`
  Any options that the renderer constructor accepts
- **`templatesLocation`** `String` `Default: ./src`
  Where the templates for the emails will live.

### Instance methods

#### **`prepare()`**

Prepares engine and renderer internally.

#### **`send(sendOptions: Options)`**

Sends an email using the configured engine.

#### Options

- **`bcc`** `String | String[]`
  Comma separated list or an array of recipients e-mail addresses that will appear on the Bcc: field.
- **`cc`** `String | String[]`
  Comma separated list or an array of recipients e-mail addresses that will appear on the Cc: field.
- **`extra`** `Object`
  Any extra options the engine may accept.
- **`from`** `String`
  The e-mail address of the sender. All e-mail addresses can be plain 'sender@server.com' or formatted 'Sender Name <sender@server.com>'.
- **`html`** `String`
  The HTML version of the message.
- **`locals`** `Object`
  Variables to be passed to the renderer to evaluate on templates.
- **`sender`** `String`
  An e-mail address that will appear on the Sender: field.
- **`subject`** `String`
  The subject of the e-mail.
- **`template`** `String`
  The name of the template without extension relative to the `templatesLocation`.
- **`text`** `String`
  The plaintext version of the message.
- **`text`** `String | String[]`
  Comma separated list or an array of recipients e-mail addresses that will appear on the To: field.

## ReplacerRenderer

The replacer renderer takes templates with the `html` and `txt` extensions to fullfil the html and text options of the message.

You can pass locals when sending and this renderer will replace their values when matching `{{ <local> }}`

```html
<html>
  <body>
    Hi my name is {{ name }}
  </body>
</html>
```

In the above example you will need to provided the local `name` to be replaced there in `{{ name }}`.

## LocalEngine

The local engine instead of sending the email via internet will just open the email in the explorer.

## TestEngine

The test engine is useful to mock to later expect a sending.

You will need to set the mock manually depending on the test framework you are using. For example for jest:

```js
import { TestEngine } from '@universal-packages/mailing'

TestEngine.mock = jest.fn()
```

## Typescript

This library is developed in TypeScript and shipped fully typed.

## Contributing

The development of this library happens in the open on GitHub, and we are grateful to the community for contributing bugfixes and improvements. Read below to learn how you can take part in improving this library.

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Contributing Guide](./CONTRIBUTING.md)

### License

[MIT licensed](./LICENSE).
