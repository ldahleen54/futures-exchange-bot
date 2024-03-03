/* eslint-disable no-tabs */
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { createBuyOrder } from '../../model/orders'
import { discordNameExists, getBuyingPower } from '../../model/users'
import { tickerExists } from '../../model/futures'
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
      if (await discordNameExists(interaction.user.globalName ?? '')) {
        if (await getBuyingPower(interaction.user.id) <= 0) {
          await interaction.reply('This order exceeds your buying power')
          return
        }
        if (await tickerExists(interaction.options.getString('ticker') ?? '')) {
          const orderId = await createBuyOrder(interaction.user.id, interaction.options.getString('ticker') ?? '', interaction.options.getNumber('amount') ?? -1)
          await interaction.reply(`Order to buy ${interaction.options.getString('ticker')} has been created with orderId: ${orderId}`)
        } else {
          await interaction.reply(`Future with the ticker ${interaction.options.getString('ticker') ?? ''} does not exist`)
        }
      } else {
        await interaction.reply('Please register using the command /register <ingamename>')
      }
    } catch (error: unknown) {
      console.log('Error received when running buy command: ' + JSON.stringify((error as Error).message))
      await interaction.reply(`Error processing the order: ${interaction.options.getString('ticker')}`)
    }
	}
}
