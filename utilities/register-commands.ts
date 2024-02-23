import { REST, Routes } from 'discord.js'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import 'dotenv/config'

const commands = []
const foldersPath = join(__dirname, '../commands')
const commandFolders = readdirSync(foldersPath)

for (const folder of commandFolders) {
  const commandsPath = join(foldersPath, folder)
  const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'))
  for (const file of commandFiles) {
    const filePath = join(commandsPath, file)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const command = require(filePath)
    if ('data' in command && 'execute' in command) {
      commands.push(command.data.toJSON())
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
    }
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN ?? '')

void (async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)
    const data = await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID ?? '', process.env.GUILD_ID ?? ''),
      { body: commands }
    )
    console.log(`Successfully reloaded ${JSON.stringify(data)} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()
