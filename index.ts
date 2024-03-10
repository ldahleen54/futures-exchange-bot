/* eslint-disable no-tabs */
import fs from 'node:fs'
import path from 'path'
import { Client, Events, GatewayIntentBits, SlashCommandBuilder, type ChatInputCommandInteraction, type Interaction, REST, Routes } from 'discord.js'
import { listUsers } from './model/users.js'

console.log('testing')
export interface Command {
  data: SlashCommandBuilder
	execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void
}

void (async () => {
	let userResults = null
	try {
		userResults = await listUsers()
	} catch (error) {
		console.log('erorr' + JSON.stringify(error))
	}
	console.log('user results after' + JSON.stringify(userResults))
})()

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const commands = new Map<string, Command>()
const commandsArray = new Array<unknown>()

const foldersPath = path.join(__dirname, 'commands')
const commandFolders = fs.readdirSync(foldersPath)

// Function to clear all existing guild commands
// async function clearGuildCommands() {
//   const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

//   try {
//     console.log('Started refreshing application (/) commands.')

//     const fetchedCommands = await rest.get(
//       Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string)
//     ) as any[];

//     console.log(`Found ${fetchedCommands.length} commands. Deleting...`)

//     for (const command of fetchedCommands) {
//       await rest.delete(
//         Routes.applicationGuildCommand(process.env.CLIENT_ID as string, process.env.GUILD_ID as string, command.id)
//       );
//     }

//     console.log('Successfully deleted all guild commands.');
//   } catch (error) {
//     console.error('Failed to delete guild commands:', error);
//   }
// }

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder)
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file)
		import(filePath).then((command: Command) => {
			commands.set(command.data.name, command)
			console.log('command name: ' + command.data.name)
			commandsArray.push(command.data.toJSON())
		}).catch(console.error)
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? '');

(async () => {
	try {
		console.log('command map: ' + JSON.stringify(commands))
		console.log('commands array: ' + JSON.stringify(commandsArray))
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID || '', process.env.GUILD_ID || ''),
			{ body: commandsArray }
		)
		console.log(`commands reloaded ${JSON.stringify(data)}`)
	} catch (error) {
		console.error(error)
	}
})()

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async readyClient => {
	// await clearGuildCommands()
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
