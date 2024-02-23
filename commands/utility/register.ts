/* eslint-disable no-tabs */
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { inGameNameExists, addUser, discordNameExists } from '../../model/users'
import { type User } from '../../types/User'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers a user')
		.addStringOption(option =>
			option
				.setName('ingamename')
				.setDescription('The username in Minecraft')
				.setRequired(true)),
	async execute (interaction: ChatInputCommandInteraction) {
		const newUser: User = {
			inGameName: interaction.options.getString('ingamename') ?? '',
			discordName: interaction.user.globalName ?? '',
			discordId: interaction.user.id,
			settledBalance: 0
		}
		if (!(await inGameNameExists(interaction.options.getString('ingamename') ?? '')) && !(await discordNameExists(interaction.options.getString('discordname') ?? ''))) {
			try {
				await addUser(newUser)
			} catch (error) {
				console.log('Unable to register user with error' + JSON.stringify(error))
				await interaction.reply('Unable to register user')
			}
			await interaction.reply('Registered with the new name')
		} else {
			await interaction.reply(`User is already registered with in-game name: ${interaction.options.getString('ingamename')}`)
		}
	}
}
