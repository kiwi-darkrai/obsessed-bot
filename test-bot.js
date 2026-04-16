const fs = require('fs');
const path = require('path');
const chalk = {
    green: (t) => `\x1b[32m${t}\x1b[0m`,
    red: (t) => `\x1b[31m${t}\x1b[0m`,
    cyan: (t) => `\x1b[36m${t}\x1b[0m`
};

// --- SIMULAZIONE SOCKET ---
const sock = {
    sendMessage: async (from, content) => {
        console.log(chalk.green(`\n[ WHATSAPP OUT ] To: ${from}`));
        console.log(`Contenuto:`, content);
        return { key: { id: 'MOCK_ID' } };
    },
    updateProfileStatus: async (status) => {
        console.log(chalk.cyan(`[ BIO UPDATE ] Nuova Bio: ${status}`));
    }
};

// --- SIMULAZIONE MESSAGGIO IN ENTRATA ---
async function simulateCommand(cmdText) {
    console.log(chalk.cyan(`\n[ TEST ] Simulo comando: ${cmdText}`));
    
    const dbPath = './database.json';
    const db = JSON.parse(fs.readFileSync(dbPath));
    const sender = "123456789@s.whatsapp.net"; // Mock sender
    const from = "group@g.us"; // Mock chat
    
    const command = cmdText.slice(1).trim().split(/ +/).shift().toLowerCase();
    const args = cmdText.trim().split(/ +/).slice(1);
    const pluginPath = path.join(__dirname, 'plugins', `${command}.js`);

    if (fs.existsSync(pluginPath)) {
        const plugin = require(pluginPath);
        try {
            // Eseguiamo il plugin passandogli il nostro socket finto
            await plugin.execute(sock, { key: { remoteJid: from } }, from, args, db, sender);
            
            // Test Bio
            db.totalCommands = (db.totalCommands || 0) + 1;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
            const bioStatus = `ꪶ ⌬ ꫂ | Comandi: ${db.totalCommands} | Dev: Mr. Kiwi 🥝`;
            await sock.updateProfileStatus(bioStatus);
            
        } catch (e) {
            console.error(chalk.red(`[ ERR ]`), e);
        }
    } else {
        console.log(chalk.red(`[ ERR ] Plugin .${command} non trovato in /plugins`));
    }
}

// --- AVVIA I TEST ---
(async () => {
    console.log("=== INIZIO TEST OFFLINE ===");
    
    // Test 1: AI (se hai axios installato)
    // await simulateCommand(".ai ciao come stai");

    // Test 2: Controllo Bio e contatore
    await simulateCommand(".weather Roma");

    console.log("\n=== TEST COMPLETATI ===");
})();

