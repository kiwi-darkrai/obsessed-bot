const fs = require('fs');
const chalk = {
    cyan: (t) => `\x1b[36m${t}\x1b[0m`,
    yellow: (t) => `\x1b[33m${t}\x1b[0m`
};

module.exports = async (sock, anu) => {
    try {
        const dbPath = './database.json';
        if (!fs.existsSync(dbPath)) return;
        const db = JSON.parse(fs.readFileSync(dbPath));
        
        const metadata = await sock.groupMetadata(anu.id);
        const participants = anu.participants;

        for (let num of participants) {
            let text = "";
            if (anu.action == 'add') {
                console.log(chalk.cyan(`[ EVENTO ] Nuova entrata: ${num} in ${metadata.subject}`));
                text = db.welcome.replace('@user', `@${num.split('@')[0]}`).replace('@group', metadata.subject);
                await sock.sendMessage(anu.id, { text, mentions: [num] });
            } else if (anu.action == 'remove') {
                console.log(chalk.yellow(`[ EVENTO ] Uscita: ${num} da ${metadata.subject}`));
                text = db.goodbye.replace('@user', `@${num.split('@')[0]}`).replace('@group', metadata.subject);
                await sock.sendMessage(anu.id, { text, mentions: [num] });
            }
        }
    } catch (err) {
        console.error("Errore nell'evento gruppo:", err);
    }
};

