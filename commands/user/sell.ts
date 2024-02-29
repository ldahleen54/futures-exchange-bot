/* eslint-disable no-tabs */
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { createSellOrder } from '../../model/orders'
import { discordNameExists } from '../../model/users'
import { tickerExists } from '../../model/futures'
module.exports = {
	data: new SlashCommandBuilder()
		.setName('sell')
		.setDescription('Sell a future')
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
      if (await discordNameExists(interaction.user.globalName ?? '')) {
        if (await tickerExists(interaction.options.getString('ticker') ?? '')) {
          const orderId = await createSellOrder(interaction.user.id, interaction.options.getString('ticker') ?? '', interaction.options.getNumber('amount') ?? -1)
          await interaction.reply(`Order to sell ${interaction.options.getString('ticker')} has been created with orderId: ${orderId}`)
        } else {
          await interaction.reply(`Future with the ticker ${interaction.options.getString('ticker') ?? ''} does not exist`)
        }
      } else {
        await interaction.reply('Please register using the command /register <ingamename>')
      }
    } catch (error: unknown) {
      console.log('Error received when running sell command: ' + JSON.stringify((error as Error).message))
      await interaction.reply(`Error processing the order: ${interaction.options.getString('ticker')}`)
    }
	}
}
