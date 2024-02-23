/* eslint-disable no-tabs */
import fs from 'node:fs'
import path from 'path'
import { Client, Events, GatewayIntentBits, SlashCommandBuilder, type ChatInputCommandInteraction, type Interaction } from 'discord.js'
import { listUsers } from './model/users.js'

export interface Command {
  data: SlashCommandBuilder
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void
}

void (async () => {
	let userResults = null
	userResults = await listUsers()
	console.log('user results after' + JSON.stringify(userResults))
})()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const commands = new Map<string, Command>()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		import(filePath).then((command: Command) => {
			commands.set(command.data.name, command)
		}).catch(console.error)
	}
}
// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return

	console.log('command name ' + interaction.commandName)

	let command: Command
	if (!commands.has(interaction.commandName)) {
		console.error(`No command matching ${interaction.commandName} was found.`)
		return
	} else {
		command = commands.get(interaction.commandName) ?? {
			data: new SlashCommandBuilder(),
			execute: () => {}
		}
	}

	try {
		await command?.execute(interaction)
	} catch (error) {
		console.error(error)
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true })
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
		}
	}
})

// Log in to Discord with your client's token
void client.login(process.env.DISCORD_TOKEN)
