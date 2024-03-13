import { CommandInteraction, SlashCommandBuilder } from 'discord.js'
export interface CommandStruct {
  data: SlashCommandBuilder
  execute: (interaction: CommandInteraction) => Promise<unknown>
}
