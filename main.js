require('dotenv').config()

const TOKEN = process.env.TOKEN
const PREFIX = process.env.PREFIX

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')

// reintroduced playlist command
const version = '0.0.1'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
})

const { Player } = require('discord-music-player')
const player = new Player(client, {
    leaveOnEmpty: false,
})
client.player = player
client.player
    // Emitted when channel was empty.
    .on('channelEmpty', (queue) =>
        console.log(`Everyone left the Voice Channel, queue ended.`)
    )
    // Emitted when a song was added to the queue.
    .on('songAdd', (queue, song) =>
        console.log(`Song ${song} was added to the queue.`)
    )
    // Emitted when a playlist was added to the queue.
    .on('playlistAdd', (queue, playlist) =>
        console.log(
            `Playlist ${playlist} with ${playlist.songs.length} was added to the queue.`
        )
    )
    // Emitted when there was no more music to play.
    .on('queueDestroyed', (queue) => console.log(`The queue was destroyed.`))
    // Emitted when the queue was destroyed (either by ending or stopping).
    .on('queueEnd', (queue) => console.log(`The queue has ended.`))
    // Emitted when a song changed.
    .on('songChanged', (queue, newSong, oldSong) =>
        console.log(`${newSong} is now playing.`)
    )
    // Emitted when a first song in the queue started playing.
    .on('songFirst', (queue, song) => console.log(`Started playing ${song}.`))
    // Emitted when someone disconnected the bot from the channel.
    .on('clientDisconnect', (queue) =>
        console.log(`I was kicked from the Voice Channel, queue ended.`)
    )
    // Emitted when deafenOnJoin is true and the bot was undeafened
    .on('clientUndeafen', (queue) => console.log(`I got undefeanded.`))
    // Emitted when there was an error in runtime
    .on('error', (error, queue) => {
        console.log(`Error: ${error} in ${queue.guild.name}`)
    })

client.slashCommands = new Collection()
client.commands = new Collection()

require('./getCommands')(client)

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.slashCommands.get(
        interaction.commandName
    )

    if (!command) {
        console.error(
            `No command matching ${interaction.commandName} was found.`
        )
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
})

client.on(Events.MessageCreate, async (message) => {
    console.log(message.content)
    if (message.author.bot) return
    if (!message.content.startsWith(PREFIX)) return
    const args = message.content.slice(1).trim().split(/ +/)
    const command = args.shift().toLowerCase().replace(PREFIX, '')
    if (!client.commands.has(command)) return

    try {
        await client.commands.get(command).execute(message, args, client)
    } catch (error) {
        console.error(error)
        await message.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        })
    }
})

client.once(Events.ClientReady, (client) => {
    require('./registerSlashCommands')
    console.log(`Ready! Logged in as ${client.user.tag}`)
    client.user.setPresence({
        activities: [{ name: `Updating... | v${version}`, type: 'STREAMING' }],
        status: 'idle',
    })
})

client.login(TOKEN)
