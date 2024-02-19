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
	async execute(interaction) {
		const subCommand = await interaction.options.getSubcommand();
		switch(subCommand) {
			case 'list':
				try {
					const futureList = futures.listFutures();
					interaction.reply('List of futures' + JSON.stringify(futureList));
					console.log('Listing futures' + JSON.stringify(futureList));
				} catch(error) {
					console.log("Error: " + JSON.stringify(error));
					await interaction.reply('Unable to list futures.');
				}
				break;
			case 'create':
				try {
					const newFuture = {
						ticker: interaction.options.getString('ticker'),
						asset: interaction.options.getString('asset'),
						expiration: interaction.options.getString('expiration'),
						strikePrice: interaction.options.getNumber('strikePrice'),
						quantity: interaction.options.getInteger('quantity'),
						premium: interaction.options.getNumber('premium')
					};
					futures.addFuture(newFuture);
					interaction.reply('Created future succesfully');
				} catch(error) {
					console.log("Error: " + JSON.stringify(error));
					await interaction.reply('Unable to create future.');
				}
				break;
		}
		console.log('executing futures');
	}
};