import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
import { CommandStruct } from '../../structs/command-struct'

class PingCommand implements CommandStruct {
  public readonly data: SlashCommandBuilder

  constructor() {
    const commandData = new SlashCommandBuilder().setName('ping').setDescription('ping')

    this.data = commandData
  }

  public async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.reply('Hello!')
  }
}

export default PingCommand
