const path = require('path');
const { readdir } = require('fs').promises;

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return (Array.prototype.concat(...files)).filter(f=>f.endsWith('.js'));
}
  
module.exports = async (client) => {
    /*
     * SLASH COMMANDS
     * */
    const slashCommandsPath = path.join(__dirname, 'slashCommands')
    const slashCommandFiles = await getFiles(slashCommandsPath)
    for (const file of slashCommandFiles) {
        console.log(file)
        const slashCommand = require(file)
        if ('data' in slashCommand && 'execute' in slashCommand) {
            client.slashCommands.set(slashCommand.data.name, slashCommand)
        } else {
            console.log(
                `[WARNING] The slash command at ${file} is missing a required "data" or "execute" property.`
            )
        }
    }

    /*
     * COMMANDS
     * */
    const commandsPath = path.join(__dirname, 'commands')
    const commandFiles = await getFiles(commandsPath)

    for (const file of commandFiles) {
        const command = require(file)
        if ('execute' in command) {
            for (const id of command.id) {
                client.commands.set(id.toLowerCase(), command)
            }
        } else {
            console.log(
                `[WARNING] The command at ${file} is missing a required "execute" property.`
            )
        }
    }
}
