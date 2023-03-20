module.exports = {
    id: ['ping'], // PREFIX + id to komenda - tutaj .ping
    name: 'Ping',
    description: 'Replies with Pong!',
    async execute(message, args, client) {
        await message.reply('Pong (to jest komenda)!')
    },
}
