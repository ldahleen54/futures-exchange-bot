/* eslint-disable no-tabs */
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { listUsers } from '../../model/users'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('users')
		.setDescription('Lists users'),
	async execute (interaction: ChatInputCommandInteraction) {
		try {
      const userList = await listUsers()
      void interaction.reply('List of users ' + JSON.stringify(userList))
      console.log('listing orders ' + JSON.stringify(userList))
    } catch (error) {
      console.log('Error: ' + JSON.stringify(error))
      await interaction.reply('Unable to list users')
    }
	}
}
