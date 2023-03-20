const {Keystore, AccountTools, VulcanHebe} = require('vulcan-api-js');
const fs = require('fs');
require('dotenv').config();

const main = async () => {
    const keystore = new Keystore();
    keystore.loadFromJsonString(fs.readFileSync("keystore.json", {encoding: 'utf-8'}));

    const client = new VulcanHebe(keystore, AccountTools.loadFromJsonString(fs.readFileSync("account.json", {encoding: 'utf-8'})))

    await client.selectStudent();

    await client.getLessons().then(lessons => {
        lessons.sort((a, b) => a.timeSlot.position - b.timeSlot.position);
        lessons.forEach(lesson => console.log(`#${lesson.timeSlot.position}: ${lesson.subject.name} (${lesson.teacherPrimary.displayName})`))
    })

    await client.getExams().then(exams => {
        const now = Date.now()
        exams = exams.filter(e => new Date(e.deadline.date) > now)
        exams.sort((a, b) => {return new Date(a.deadline.date) - new Date(b.deadline.date)});
        exams.forEach(exams => {
            console.log(`${exams.subject.name} (${exams.type}): ${exams.topic} - ${exams.deadline.date}`)
        })
    })
}
main();