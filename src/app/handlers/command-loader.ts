import { Client, Collection, REST, Routes } from 'discord.js'
import { readdirSync } from 'fs'
import path from 'path'
import { CommandStruct } from '../structs/command-struct'
import { env } from '../../config/env'

export class CommandsLoader {
  private readonly client: Client
  public readonly commands: Collection<string, CommandStruct>

  constructor(client: Client) {
    this.client = client
    this.commands = new Collection()
  }

  public loadCommands(): void {
    const commandCategories = readdirSync(path.join(__dirname, '../commands'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    for (const category of commandCategories) {
      const categoryPath = path.join(__dirname, `../commands/${category}`)
      const commandFiles = readdirSync(categoryPath).filter((file) => file.endsWith('.ts') || file.endsWith('.js'))

      for (const file of commandFiles) {
        const commandName = file.replace('.ts', '')
        const commandModule = require(path.join(categoryPath, file))
        const commandClass = commandModule.default

        if (commandClass && typeof commandClass === 'function') {
          const commandInstance = new commandClass() as CommandStruct
          const lowerCaseCommandName = commandName.toLowerCase()

          this.commands.set(lowerCaseCommandName, commandInstance)
          console.log(`Command ${commandName} registered`)
        }
      }
    }
  }

  public async registerCommands(): Promise<void> {
    const commandsData = this.commands.map((command) => command.data)

    const rest = new REST().setToken(env.DISCORD_BOT_TOKEN)

    if (!this.client.user) {
      console.error('Bot user is null. Make sure the bot is logged in.')
      return
    }

    try {
      console.log('Started refreshing global application (/) commands.')

      await rest.put(Routes.applicationCommands(this.client.user.id), { body: commandsData })

      console.log('Successfully reloaded global application (/) commands.')
    } catch (error) {
      console.error(error)
    }
  }
}
