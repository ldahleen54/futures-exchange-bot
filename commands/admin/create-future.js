const { SlashCommandBuilder } = require('discord.js');
const users = require('../../model/futures.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('futures')
		.setDescription('Create, remove, modify or list existing futures.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Create a new Future.')
				.addStringOption(option => 
					option
						.setName('ticker')
						.setDescription('Ticker symbol for the future.')
						.setRequired(true))
				.addStringOption(option => 
					option
						.setName('asset')
						.setDescription('The name of the asset.')
						.setRequired(true))
				.addNumberOption(option => 
					option
						.setName('strikeprice')
						.setDescription('The strike price for the future contract.')
						.setRequired(true))
				.addStringOption(option => 
					option
						.setName('expiration')
						.setDescription('Expiration date for the future. Please use MM-DD-YYYY format.')
						.setRequired(true))
				.addIntegerOption(option => 
					option
						.setName('quantity')
						.setDescription('Quantity of assets to track.')
						.setRequired(true))
				.addNumberOption(option => 
					option
						.setName('premium')
						.setDescription('The premium to subtract off of the user buying the contract')
						.setRequired(true))
		),
	async execute() {
		console.log('execute future comand');
	},
};