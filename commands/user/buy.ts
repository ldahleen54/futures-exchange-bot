/* eslint-disable no-tabs */
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { createOrder } from '../../model/orders'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Buy a future')
    .addStringOption(option =>
			option
				.setName('ticker')
				.setDescription('Ticker symbol of the future')
				.setRequired(true))
    .addNumberOption(option =>
      option
        .setName('amount')
        .setDescription('Amount of future contracts')
        .setRequired(true)),
	async execute (interaction: ChatInputCommandInteraction) {
    try {
      const orderId = await createOrder(interaction.user.id, interaction.options.getString('ticker') ?? '', interaction.options.getNumber('amount') ?? -1)
      await interaction.reply(`Order has been created with Order Number: ${orderId}`)
    } catch (error) {
      await interaction.reply(`Error processing the order: ${interaction.options.getString('ticker')}`)
    }
	}
}
