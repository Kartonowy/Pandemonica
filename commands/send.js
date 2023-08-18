const cron = require("node-cron");
const fs = require("fs");

module.exports = {
  id: ["spam"], // PREFIX + id to komenda - tutaj .ping
  name: "Spam",
  description: "Replies with Spam!",
  async execute(message, args, client) {
    const files = fs.readdirSync(__dirname + "/../days");
    let counter = 0;
    cron.schedule("1-59 * * * * *", () => {
      client.users.fetch("528654584474894348", false).then((user) => {
        let insides = fs.readFileSync(
          __dirname + "/../days/" + files[counter],
          "utf-8"
        );
        user.send(insides);
        counter++;
        if (counter == 7) {
          counter = 0;
        }
      });
    });
  },
};
