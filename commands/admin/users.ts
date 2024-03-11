/* eslint-disable no-tabs */
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { listUsers } from '../../model/users'

export const data = new SlashCommandBuilder()
  .setName('users')
  .setDescription('Lists users')
export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    const userList = await listUsers()
    void interaction.reply('List of users ' + JSON.stringify(userList))
    console.log('listing orders ' + JSON.stringify(userList))
  } catch (error) {
    console.log('Error from command execution: ' + JSON.stringify(error))
    await interaction.reply('Unable to list users')
  }
}
