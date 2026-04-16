const { 
    default: makeWASocket, 
    useMultiFileAuthState, 
    fetchLatestBaileysVersion, 
    DisconnectReason 
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');

// --- CONFIGURAZIONE UI & COLORI ---
const chalk = {
    green: (t) => `\x1b[32m${t}\x1b[0m`,
    blue: (t) => `\x1b[34m${t}\x1b[0m`,
    red: (t) => `\x1b[31m${t}\x1b[0m`,
    yellow: (t) => `\x1b[33m${t}\x1b[0m`,
    cyan: (t) => `\x1b[36m${t}\x1b[0m`,
    magenta: (t) => `\x1b[35m${t}\x1b[0m`,
    bold: (t) => `\x1b[1m${t}\x1b[22m`
};

const dbPath = './database.json';

// --- CARICAMENTO LOGICA EVENTI ESTERNA ---
const groupUpdate = require('./eventi/group_update');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessione');
    const { version } = await fetchLatestBaileysVersion();
    
    // UI STARTUP - HACKER STYLE
    console.clear();
    console.log(chalk.cyan(`
    
          .  ___________________________  .
          . [                           ] .
          . [      ꪶ  █████████  ꫂ      ] .
          . [      ███       ███      ] .
          . [    ███    ⌬    ███    ] .
          . [      ███       ███      ] .
          . [      ꪶ  █████████  ꫂ      ] .
          . [___________________________] .
          .  .  .  .  .  .  .  .  .  .  .

        ꪶ ⌬ ꫂ | ʙᴏᴛ - ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴍʀ. ᴋɪᴡɪ
    `));
    console.log(chalk.green(`[ SYSTEM ] Avvio del kernel in corso...`));
    console.log(chalk.cyan(`[ VERSION ] Baileys v${version.join('.')}\n`));

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["ꪶ ⌬ ꫂ | ʙᴏᴛ", "Linux", "3.0.0"]
    });

    // --- PAIRING CODE CONFIG ---
    if (!sock.authState.creds.registered) {
        console.log(chalk.yellow(`[ AUTH ] Numero non registrato. Inserisci il numero (es: 39333...):`));
        const phoneNumber = await new Promise(resolve => {
            process.stdin.once('data', data => resolve(data.toString().trim()));
        });
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(chalk.bold(chalk.green(`\n[ PAIRING CODE ] » ${code}\n`)));
        }, 3000);
    }

    sock.ev.on('creds.update', saveCreds);

    // --- GESTIONE EVENTI GRUPPO (WELCOME/BYE) ---
    sock.ev.on('group-participants.update', async (anu) => {
        await groupUpdate(sock, anu);
    });

    // --- GESTIONE MESSAGGI & COMANDI ---
    sock.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0];
        if (!mek.message || mek.key.fromMe) return;

        const from = mek.key.remoteJid;
        const sender = mek.key.participant || mek.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const type = Object.keys(mek.message)[0];
        
        // Estrazione testo migliorata
        const body = (type === 'conversation') ? mek.message.conversation : 
                     (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : 
                     (type === 'imageMessage') ? mek.message.imageMessage.caption : 
                     (type === 'videoMessage') ? mek.message.videoMessage.caption : '';
        
        const db = JSON.parse(fs.readFileSync(dbPath));
        const isOwner = db.owners.includes(sender);

        // LOG MESSAGGI UI
        const time = new Date().toLocaleTimeString();
        let role = chalk.blue('[ USER ]');
        if (isOwner) role = chalk.red('[ OWNER ]');
        else if (isGroup) {
            try {
                const groupMetadata = await sock.groupMetadata(from);
                const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
                if (groupAdmins.includes(sender)) role = chalk.yellow('[ ADMIN ]');
            } catch (e) {}
        }

        console.log(`${chalk.magenta(`[${time}]`)} ${role} ${chalk.green(mek.pushName || 'User')}: ${chalk.bold(body)}`);

        // ESECUZIONE COMANDI
        if (!body.startsWith('.')) return;
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);

        const pluginPath = path.join(__dirname, 'plugins', `${command}.js`);
        if (fs.existsSync(pluginPath)) {
            const plugin = require(pluginPath);
            try {
                // Esecuzione
                await plugin.execute(sock, mek, from, args, db, sender);
                
                // --- AGGIORNAMENTO BIO & DATABASE ---
                db.totalCommands = (db.totalCommands || 0) + 1;
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
                
                const bioStatus = `ꪶ ⌬ ꫂ | Comandi: ${db.totalCommands} | Dev: Mr. Kiwi 🥝`;
                await sock.updateProfileStatus(bioStatus);
                
                console.log(chalk.green(`[ CMD ] .${command} eseguito correttamente.`));
            } catch (e) { 
                console.error(chalk.red(`[ ERR ] Errore nel comando .${command}:`), e); 
            }
        }
    });

    // --- GESTIONE CONNESSIONE ---
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(chalk.red('[ SYSTEM ] Connessione persa. Riconnessione:'), shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green('\n' + '─'.repeat(40)));
            console.log(chalk.bold(chalk.green('    ꪶ ⌬ ꫂ | SYSTEM ONLINE')));
            console.log(chalk.green('─'.repeat(40) + '\n'));
        }
    });
}

startBot();

