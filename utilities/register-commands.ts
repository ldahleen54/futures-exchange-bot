// Importing modules using ES6 syntax
import { REST } from 'discord.js'
import { Routes } from 'discord-api-types/v9'
import * as fs from 'fs'
import * as path from 'path'
import 'dotenv/config'

// Assuming commands are properly typed elsewhere
interface Command {
    data: {
        toJSON: () => unknown
    }
    execute: (...args: unknown[]) => void
}

const commands: unknown[] = []
const foldersPath = path.join(__dirname, '../commands')
const commandFolders = fs.readdirSync(foldersPath)

// for (const folder of commandFolders) {
//     const commandsPath = path.join(foldersPath, folder);
//     const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

//     for (const file of commandFiles) {
//         const filePath = path.join(commandsPath, file);
//         // Dynamically importing commands
//         import(filePath).then((command: Command) => {
//             if ('data' in command && 'execute' in command) {
//                 commands.push(command.data.toJSON());
//             } else {
//                 console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
//             }
//         }).catch((error) => {
//             console.error(`Error loading command at ${filePath}:`, error)
//         });
//     }
// }

const clearCommands = async () => {
    try {
        // Fetch the list of all commands for the guild
        const commands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string)
        )

        // Delete all commands for the guild
        for (const command of commands) {
            await rest.delete(
                Routes.applicationGuildCommand(process.env.CLIENT_ID as string, process.env.GUILD_ID as string, command.id)
            )
        }
        console.log('Successfully deleted all guild commands.')
    } catch (error) {
        console.error('Failed to delete guild commands:', error)
    }
}

const loadCommands = async () => {
    const importPromises: Promise<void>[] = []

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            const filePath = path.join(commandsPath, file)
            const importPromise = import(filePath).then((command: Command) => {
                if ('data' in command && 'execute' in command) {
                    commands.push(command.data.toJSON())
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
                }
            }).catch((error) => {
                console.error(`Error loading command at ${filePath}:`, error)
            })
            importPromises.push(importPromise)
        }
    }

    await Promise.all(importPromises)
};


const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

(async () => {
    try {
        await clearCommands()
        await loadCommands()
        console.log(`Started refreshing ${commands.length} application (/) commands.`)
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
            { body: commands },
        )
        console.log(`Successfully reloaded ${commands.length} application (/) commands.`)
    } catch (error) {
        console.error(error)
    }
})()

