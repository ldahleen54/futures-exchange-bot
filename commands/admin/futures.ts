/* eslint-disable no-tabs */
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { addFuture, listFutures } from '../../model/futures'
import { type Future } from '../../types/Future'

export const data = new SlashCommandBuilder()
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
)
export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
const subCommand = interaction.options.getSubcommand()
switch (subCommand) {
	case 'list':
		try {
			const futureList = await listFutures()
			void interaction.reply('List of futures' + JSON.stringify(futureList))
			console.log('Listing futures' + JSON.stringify(futureList))
		} catch (error) {
			console.log('Error: ' + JSON.stringify(error))
			await interaction.reply('Unable to list futures.')
		}
		break
	case 'create':
		try {
			const newFuture: Future = {
				ticker: interaction.options.getString('ticker') ?? '',
				asset: interaction.options.getString('asset') ?? '',
				expiration: interaction.options.getString('expiration') ?? '',
				strikePrice: interaction.options.getNumber('strikeprice') ?? -1,
				quantity: interaction.options.getInteger('quantity') ?? -1,
				premium: interaction.options.getNumber('premium') ?? -1
			}
			await addFuture(newFuture)
			void interaction.reply('Created future succesfully')
		} catch (error) {
			console.log('Error: ' + JSON.stringify(error))
			await interaction.reply('Unable to create future.')
		}
		break
}
console.log('executing futures')
}
