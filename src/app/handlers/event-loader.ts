import { Client } from 'discord.js'
import { readdirSync } from 'fs'
import path from 'path'
import { EventStruct } from '../structs/event-struct'

export class EventLoader {
  constructor(private client: Client) {
    this.client = client
  }

  public async loadEvents(): Promise<void> {
    const eventCategories = readdirSync(path.join(__dirname, '../events'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const category of eventCategories) {
      const categoryPath = path.join(__dirname, `../events/${category}`)
      const eventFiles = readdirSync(categoryPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

      for (const file of eventFiles) {
        const eventModule = await import(path.join(categoryPath, file))
        const eventClass = eventModule.default

        if (eventClass && typeof eventClass === 'function') {
          const eventInstance = new eventClass() as EventStruct
          this.client.on(eventInstance.name, (...args) => eventInstance.run(...args, this.client))

          console.log(`Event ${eventInstance.name} loaded!`)
        }
      }
    }
  }
}
export { EventStruct }
