const {Keystore, AccountTools, registerAccount} = require('vulcan-api-js');
const fs = require('fs');

const main = async () => {
    const keystore = new Keystore();
    keystore.loadFromJsonString(fs.readFileSync("keystore.json", { encoding: 'utf-8' }));

    const account = await registerAccount(keystore, {TOKEN: "3S17GC9"}, {SYMBOL: "poznan"}, {PIN: "641702"});
    fs.writeFileSync("DStaccount.json", AccountTools.dumpToJsonString(account), { encoding: 'utf-8' });
};

main();