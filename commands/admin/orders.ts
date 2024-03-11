/* eslint-disable no-tabs */
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js'
import { listOrders } from '../../model/orders'

export const data = new SlashCommandBuilder()
		.setName('orders')
		.setDescription('List orders')
export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    const orderList = await listOrders()
    void interaction.reply('List of orders ' + JSON.stringify(orderList))
    console.log('listing orders ' + JSON.stringify(orderList))
  } catch (error) {
    console.log('Error: ' + JSON.stringify(error))
    await interaction.reply('Unable to list orders')
  }
}
