import { EngineInterface, SendOptions } from './Mailing.types'

export default class TestEngine implements EngineInterface {
  public static mock: any

  public static setMock(mock: any): void {
    this.mock = mock
  }

  public async send(options: SendOptions): Promise<void> {
    if (TestEngine.mock) TestEngine.mock(options)
  }
}
