const { EmbedBuilder } = require('discord.js')

module.exports = {
    id: ['help'], // PREFIX + id to komenda - tutaj .ping
    name: 'Help',
    description: 'Displays all commands!',
    async execute(message, args, client) {

        let helpEmbed = new EmbedBuilder()
            .setColor('#BF3636');
        switch (args[0]) {
            case 'music':
                if (!args[1]) {
                    helpEmbed
                        .setTitle('Komendy muzyczne')
                        .addFields( { name: 'play', value: 'Dodaje dany utwór do kolejki'})
                        .addFields( { name: 'skip', value: 'Pomija utwór'})
                        .addFields( { name: 'stop', value: 'Zatrzymuje kolejkę'})
                        .addFields( { name: 'remove', value: 'Usuwa utwór z kolejki'})
                        .addFields( { name: 'queue', value: 'Wyświetla kolejkę'})
                        .addFields( { name: 'loop', value: 'Zapętla. Sprawdź ".help music loop" po więcej'})
                } else if (args[1] == 'loop'){
                    helpEmbed
                        .setTitle('Opcje komendy loop')
                        .addFields( { name: 'song', value: 'Zapętla jeden utwór'})
                        .addFields( { name: 'queue', value: 'Zapętla kolejkę'})
                        .addFields( { name: 'disable', value: 'Wyłącza kolejkę'})
                }
                break
            case 'nsfw':
                helpEmbed
                    .setTitle('Komendy nsfw')
                    .addFields( { name: 'derpibooru', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'e621', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'e926', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'gelbooru', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'hypnohub', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'kc', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'kn', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'realbooru', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'rule34', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'paheal', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'safebooru', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'tbib', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'xbooru', value: 'Wysyła obraz z tytułowej platformy'})
                    .addFields( { name: 'yandere', value: 'Wysyła obraz z tytułowej platformy'})
                break
            case 'global':
                helpEmbed
                    .setTitle('Komendy ogólne')
                    .addFields( {name:'help', value:'ta lista'})
                    .addFields( {name:'ping', value:'Komenda testowa'})
            default:
                helpEmbed
                    .setTitle('Lista kategorii')
                    .addFields( { name: 'music', value: 'Komendy muzyczne'})
                    .addFields( { name: 'nsfw', value: 'Komendy nsfw'})
                    .addFields( {name: 'global', value: 'Komendy ogólne'})
        }
        await message.reply({ embeds: [helpEmbed]})
    },
}
