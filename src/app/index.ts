import 'dotenv/config'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { env } from '../config/env'
import { EventLoader } from './handlers/event-loader'
import { CommandsLoader } from './handlers/command-loader'

class App extends Client {
  private readonly eventLoader: EventLoader
  private readonly commandsLoader: CommandsLoader

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
      ],
    })

    this.commandsLoader = new CommandsLoader(this)
    this.eventLoader = new EventLoader(this)

    this.loaders()
  }
  // loader functions handling.
  private async loaders(): Promise<void> {
    this.eventLoader.loadEvents()
    this.commandsLoader.loadCommands()
  }

  public start(): void {
    this.login(env.DISCORD_BOT_TOKEN).then(() => {
      this.commandsLoader.registerCommands()
    })
  }
}

//start bot
const app = new App()
app.start()
