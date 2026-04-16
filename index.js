const { 
    default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, 
    makeInMemoryStore, DisconnectReason 
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');

// COLORI PER UI
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

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessione');
    const { version } = await fetchLatestBaileysVersion();
    
    // UI STARTUP
    console.clear();
    console.log(chalk.green(`
    
 ██████╗ ██████╗ ███████╗███████╗███████╗███████╗███████╗██████╗ 
██╔═══██╗██╔══██╗██╔════╝██╔════╝██╔════╝██╔════╝██╔════╝██╔══██╗
██║   ██║██████╔╝███████╗█████╗  ███████╗███████╗█████╗  ██║  ██║
██║   ██║██╔══██╗╚════██║██╔══╝  ╚════██║╚════██║██╔══╝  ██║  ██║
╚██████╔╝██████╔╝███████║███████╗███████║███████║███████╗██████╔╝
 ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚══════╝╚══════╝╚═════╝ 
        ꪶ ⌬ ꫂ | ʙᴏᴛ - ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴍʀ. ᴋɪᴡɪ
    `));
    console.log(chalk.cyan(`[ SYSTEM ] Connessione in corso...`));
    console.log(chalk.cyan(`[ VERSION ] Baileys v${version.join('.')}\n`));

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["ꪶ ⌬ ꫂ | ʙᴏᴛ", "Linux", "3.0.0"]
    });

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

    sock.ev.on('messages.upsert', async chatUpdate => {
        const mek = chatUpdate.messages[0];
        if (!mek.message || mek.key.fromMe) return;

        const from = mek.key.remoteJid;
        const sender = mek.key.participant || mek.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const type = Object.keys(mek.message)[0];
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : (type === 'imageMessage') ? mek.message.imageMessage.caption : '';
        
        const db = JSON.parse(fs.readFileSync(dbPath));
        const isOwner = db.owners.includes(sender);

        // LOG MESSAGGI UI
        const time = new Date().toLocaleTimeString();
        const groupName = isGroup ? (await sock.groupMetadata(from)).subject : 'Private Chat';
        const pushName = mek.pushName || 'User';

        // RUOLO LOG
        let role = chalk.bold(chalk.blue('[ USER ]'));
        if (isOwner) role = chalk.bold(chalk.red('[ OWNER ]'));
        else if (isGroup) {
            const groupMetadata = await sock.groupMetadata(from);
            const groupAdmins = groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id);
            if (groupAdmins.includes(sender)) role = chalk.bold(chalk.yellow('[ ADMIN ]'));
        }

        console.log(`${chalk.magenta(`[${time}]`)} ${role} ${chalk.green(pushName)}: ${chalk.bold(body)} ${chalk.cyan(`@ ${groupName}`)}`);

        // GHOST MUTE CHECK
        if (isGroup && db.mutedUsers[from]?.includes(sender)) {
            await sock.sendMessage(from, { delete: mek.key });
            return;
        }

        // DB INCREMENT
        if (isGroup) {
            if (!db.users[sender]) db.users[sender] = { msgCount: 0, genere: "Non impostato" };
            db.users[sender].msgCount += 1;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }

        if (!body.startsWith('.')) return;
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);

        const pluginPath = path.join(__dirname, 'plugins', `${command}.js`);
        if (fs.existsSync(pluginPath)) {
            const plugin = require(pluginPath);
            const groupMetadata = isGroup ? await sock.groupMetadata(from) : '';
            const groupAdmins = isGroup ? groupMetadata.participants.filter(v => v.admin !== null).map(v => v.id) : [];
            const isAdmin = groupAdmins.includes(sender);

            if (plugin.ownerOnly && !isOwner) return;
            if (plugin.adminOnly && !isAdmin && !isOwner) return;

            try {
                await plugin.execute(sock, mek, from, args, db, sender);
                console.log(chalk.green(`[ CMD ] Eseguito: .${command}`));
            } catch (e) { console.error(chalk.red(`[ ERR ] .${command}:`), e); }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            console.log(chalk.red('[ SYSTEM ] Connessione persa. Riavvio...'));
            if ((lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
        } else if (connection === 'open') {
            console.log(chalk.green('-------------------------------------------'));
            console.log(chalk.bold(chalk.green('    STATUS: ONLINE - SYSTEM OPERATIVE')));
            console.log(chalk.green('-------------------------------------------\n'));
        }
    });
}

startBot();

