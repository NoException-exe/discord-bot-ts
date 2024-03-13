import { Client, Events } from 'discord.js'
import { EventStruct } from '../../handlers/event-loader'

class ReadyEvent implements EventStruct {
  public name = Events.ClientReady

  public run(client: Client): void {
    console.log(`Bot ${client.user?.username} is ready`)
  }
}

export default ReadyEvent
