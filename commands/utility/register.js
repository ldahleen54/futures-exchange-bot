const { SlashCommandBuilder } = require('discord.js');
const users = require('../../model/users.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('register')
		.setDescription('Registers a user')
		.addStringOption(option => 
			option
				.setName('ingamename')
				.setDescription('The username in Minecraft')
				.setRequired(true)),
	async execute(interaction) {
		const newUser = {
			inGameName: interaction.options.getString('ingamename'),
			discordName: interaction.user.globalName,
			discordId: interaction.user.id,
			settledBalance: 0
		};
		if (!users.inGameName(interaction.options.getString('ingamename'))) {
			try {
				users.addUser(newUser);
			} catch (error) {
				console.log("Unable to register user with error" + JSON.stringify(error));
				await interaction.reply('Unable to register user');
			}
			await interaction.reply('Registered with the new name');
		} else {
			await interaction.reply('User is already registered witht that in-game name');
		}
	},
};