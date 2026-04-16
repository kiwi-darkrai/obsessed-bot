const { 
    default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, 
    makeInMemoryStore, DisconnectReason 
} = require("@whiskeysockets/baileys");
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { Boom } = require('@hapi/boom');

// Inizializzazione Database
const dbPath = './database.json';
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ 
        owners: ["212783200686@s.whatsapp.net", "27833368862@s.whatsapp.net"],
        mutedUsers: {}, // Per .muta individuale
        users: {} 
    }, null, 2));
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessione');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        browser: ["ꪶ ⌬ ꫂ | ʙᴏᴛ", "Chrome", "1.0.0"]
    });

    // PAIRING CODE
    if (!sock.authState.creds.registered) {
        console.log("Inserisci il numero (es: 393331234567):");
        const phoneNumber = await new Promise(resolve => {
            process.stdin.once('data', data => resolve(data.toString().trim()));
        });
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n｢ ⚡ ｣ PAIRING CODE: ${code}\n`);
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
        const body = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : '';
        
        const db = JSON.parse(fs.readFileSync(dbPath));
        const isOwner = db.owners.includes(sender);

        // LOGICA GHOST MUTE (Cancella messaggi di chi è mutato)
        if (isGroup && db.mutedUsers[from]?.includes(sender)) {
            await sock.sendMessage(from, { delete: mek.key });
            return;
        }

        // CONTEGGIO MESSAGGI
        if (isGroup) {
            if (!db.users[sender]) db.users[sender] = { msgCount: 0, genere: "Non impostato" };
            db.users[sender].msgCount += 1;
            fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        }

        if (!body.startsWith('.')) return;
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);

        // GESTORE PLUGIN
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
            } catch (e) { console.error(e); }
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            if ((lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut) startBot();
        } else if (connection === 'open') {
            console.log('｢ ✅ ｣ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE');
        }
    });
}

startBot();

