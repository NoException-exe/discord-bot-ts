import { CommandInteraction, InteractionResponse, Message, SlashCommandBuilder } from 'discord.js'
import { CommandStruct } from '../../structs/command-struct'

class HelloCommand implements CommandStruct {
  public readonly data: SlashCommandBuilder

  constructor() {
    const commandData = new SlashCommandBuilder().setName('hello').setDescription('Say any message')

    commandData.addStringOption((option) =>
      option.setName('message').setDescription('The message to say').setRequired(true)
    )

    this.data = commandData
  }

  public async execute(interaction: CommandInteraction): Promise<InteractionResponse<boolean>> {
    const msg = interaction.options.get('message')?.value as string

    return interaction.reply({
      content: msg,
      ephemeral: true,
    })
  }
}

export default HelloCommand
