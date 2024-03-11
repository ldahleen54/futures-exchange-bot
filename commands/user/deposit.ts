/* eslint-disable no-tabs */
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js'
import { deposit, discordNameExists } from '../../model/users'

export const data = new SlashCommandBuilder()
  .setName('deposit')
  .setDescription('Deposit money into your account')
  .addNumberOption(option =>
    option
      .setName('amount')
      .setDescription('Amount of money you\'re despositing')
      .setRequired(true))
export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  try {
    const depositAmount = interaction.options.getNumber('amount') ?? 0
    const discordId = interaction.user.id ?? ''
    if (depositAmount <= 0) {
      await interaction.reply('Deposit amount must be more than 0')
      return
    }
    if (!(await discordNameExists(interaction.user.globalName ?? ''))) {
      await interaction.reply('Please register using the command /register <ingamename>')
      return
    }
    if (await deposit(discordId, depositAmount) !== null) {
      await interaction.reply(`Deposited $${depositAmount} into your account.`)
      return
    }
    await interaction.reply('Unable to deposit into your account')
  } catch (error: unknown) {
    console.log('Error received when running deposit command: ' + JSON.stringify((error as Error).message))
    await interaction.reply('We are unable to process your deposit')
  }
}
