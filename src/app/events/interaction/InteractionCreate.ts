import { Client, Events, Interaction } from 'discord.js'
import { EventStruct } from '../../handlers/event-loader'
import { commands } from '../../commands'

class InteractionCreate implements EventStruct {
  public name = Events.InteractionCreate

  public run(interaction: Interaction, client: Client): void {
    if (!interaction.isCommand()) return

    const { commandName } = interaction

    if (commands[commandName as keyof typeof commands]) {
      const command = new commands[commandName as keyof typeof commands].default()

      try {
        command.execute(interaction)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

export default InteractionCreate
