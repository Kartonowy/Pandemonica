const { REST, Routes } = require('discord.js')
const fs = require('fs')
const path = require('path');
const { readdir } = require('fs').promises;


const CLIENT_ID = process.env.CLIENT_ID
const TOKEN = process.env.TOKEN

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return (Array.prototype.concat(...files)).filter(f=>f.endsWith('.js'));
}
// and deploy your commands!
(async () => {
const commands = []
const slashCommandsPath = path.join(__dirname, 'slashCommands')
const slashCommandFiles = await getFiles(slashCommandsPath)
for (const file of slashCommandFiles) {
    const command = require(file)
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        )

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands(CLIENT_ID), {
            body: commands,
        })

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        )
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error)
    }
})()
