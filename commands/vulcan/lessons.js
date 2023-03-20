const {Keystore, AccountTools, VulcanHebe} = require('vulcan-api-js')
const fs = require('fs')
const {EmbedBuilder} = require('discord.js')
const path = require('path')

module.exports = {
    id: ['lessons', 'lekcje','timetable','l'], // PREFIX + id to komenda - tutaj .ping
    name: 'Plan lekcji',
    description: 'Wysyła dzisiejszy plan lekcji!',
    async execute(message, args, client) {
        await message.deferReply();
        const keystore = new Keystore();
        keystore.loadFromJsonString(fs.readFileSync(path.join(__dirname, "../../vulcan/keystore.json"), {encoding: 'utf8'}))

        const vulcanHebe = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync("account.json", {encoding: 'utf-8'})))
        let timetable = new EmbedBuilder().setColor('#FF1243');
        await vulcanHebe.getLessons().then(lessons => {
            lessons.sort((a,b) => a.timeSlot.position - b.timeSlot.position)
            lessons.forEach(lesson => {
                timetable.setTitle(`#${lesson.timeSlot.position}`)
                timetable.addFields(`${lesson.subject.name} (${lesson.teacherPrimary.displayName})`)
            })
        })

        await message.editReply({embeds: [timetable]});
    },
}
