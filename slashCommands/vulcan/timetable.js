const {Keystore, AccountTools, VulcanHebe} = require('vulcan-api-js')
const fs = require('fs')
const {EmbedBuilder} = require('discord.js')
const { SlashCommandBuilder } = require('discord.js')
const path = require('path')

module.exports = {
    name: 'Timetable',
    description: 'Replies with Timetable!',
    data: new SlashCommandBuilder()
        .setName('timetable')
        .setDescription('Replies with Timetable!'),
    async execute(interaction) {
        await interaction.deferReply();
        const keystore = new Keystore();
        keystore.loadFromJsonString(fs.readFileSync(path.join(__dirname, "../../vulcan/keystore.json"), {encoding: 'utf8'}))

        const vulcanHebe = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync( path.join(__dirname, "../../vulcan/accounts/WMaccount.json"), {encoding: 'utf-8'} )));
        let timetable = new EmbedBuilder().setColor('#FF1243');

        await vulcanHebe.selectStudent();

        await vulcanHebe.getLessons().then(lessons => {
            lessons.sort((a,b) => a.timeSlot.position - b.timeSlot.position)
            timetable.setTitle(`Plan lekcji`)
            lessons.forEach(lesson => {
                timetable.addFields({ name : `${lesson.timeSlot.position}`, value: `${lesson.subject.name} (${lesson.teacherPrimary.displayName})`})
            })
        })

        await interaction.editReply({embeds: [timetable]});
    },
}
