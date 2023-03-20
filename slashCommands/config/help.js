const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { readdir } = require('fs').promises;
const fs = require('fs');
module.exports = {
    name: 'Help',
    description: 'Replies with the list of commands!',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Replies with the list of commands!')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('What commands you need me to list?')
                .setRequired(false)),
    async execute(interaction) {
        await interaction.deferReply();

        let helpEmbed = new EmbedBuilder()
            .setColor('#154c79')
            .setTitle('Lista komend:')
        if (interaction.options.get('option')) {

        } else {
            let helpArray = [];
            const folder = './slashCommands';
            fs.readdir(folder, (err, files) => {
                files.forEach(file => {
                    if (file.endsWith('.js')) {
                        helpEmbed.addFields({ name: `${file}`, value: `Lista komend z zakresu ${file}`})
                        console.log(file)
                    }
                });
              });
        }
        await interaction.editReply({ embeds: [helpEmbed]})
    },
}
