import { EngineInterface, SendOptions } from './Mailing.types'

export default class TestEngine implements EngineInterface {
  public static sendHistory: SendOptions[] = []

  public static reset() {
    TestEngine.sendHistory = []
  }

  public async send(options: SendOptions): Promise<void> {
    TestEngine.sendHistory.push(options)
  }
}
