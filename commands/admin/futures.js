const { SlashCommandBuilder } = require('discord.js');
const futures = require('../../model/futures.js');
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
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('List existing futures.')
		),
	async list() {
		try {
			const futureList = futures.listFutures();
			interaction.reply('List of futures' + JSON.stringify(futureList));
			console.log('Listing futures' + JSON.stringify(futureList));
		} catch(error) {
			console.log("Error: " + JSON.stringify(error));
			await interaction.reply('Unable to list futures.');
		}
	},
	async create(ticker, itemName, expiration, strikePrice, quantity, premium) {
		try {
			const newFuture = {
				ticker: ticker,
				itemName: itemName,
				expiration: expiration,
				strikePrice: strikePrice,
				quantity: quantity,
				premium: premium
			};
			futures.addFuture(newFuture);
			interaction.reply('Created future succesfully');
		} catch(error) {
			console.log("Error: " + JSON.stringify(error));
			await interaction.reply('Unable to create future.');
		}
	}
};