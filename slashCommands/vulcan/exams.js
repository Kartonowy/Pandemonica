const {Keystore, AccountTools, VulcanHebe} = require('vulcan-api-js')
const fs = require('fs')
const {EmbedBuilder} = require('discord.js')
const { SlashCommandBuilder } = require('discord.js')
const path = require('path')
const { readdir } = require('fs').promises;

module.exports = {
    name: 'Exams',
    description: 'Replies with Exams!',
    data: new SlashCommandBuilder()
        .setName('exams')
        .setDescription('Replies with Exams!'),
    async execute(interaction) {
        await interaction.deferReply();
        const keystore = new Keystore();
        keystore.loadFromJsonString(fs.readFileSync(path.join(__dirname, "../../vulcan/keystore.json"), {encoding: 'utf8'}))

        var accounts = [];
        var examines = [];
        const commandFiles = await getFiles(path.join(__dirname, '../../vulcan/accounts/'))

        for (const account of commandFiles) {
            accounts.push(account);
        }

        let examField = new EmbedBuilder().setColor('#FF1243');

        for (const account of accounts) {

            const Hebe = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync(account), {encoding: 'utf-8'} ));

            await Hebe.selectStudent();

            await Hebe.getExams().then(exams => {
                const now = Date.now();
                exams = exams.filter(e => new Date(e.deadline.date) > now)
                exams.sort((a, b) => {return new Date(a.deadline.date) - new Date(b.deadline.date)});

                exams.forEach(exam => {
                    examines.concat(exam)
                })
            })
        }
        console.log(examines)

        await interaction.editReply("xd");
    },
}

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(dirents.map((dirent) => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));
    return (Array.prototype.concat(...files)).filter(f=>f.endsWith('.json'));
}