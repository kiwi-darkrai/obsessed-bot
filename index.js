import pkg from '@realvare/baileys'
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers
} = pkg

import pino from 'pino'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import readline from 'readline'
import { pathToFileURL } from 'url'

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => { process.stdout.write(text); rl.question('', resolve) })

// Inizializzazione Database rapida
const dbPath = './database.json'
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ owners: ["27833368862@s.whatsapp.net"], totalCommands: 0 }, null, 2))
}

const printBanner = () => {
    console.clear()
    console.log(chalk.cyan(`
    
             ██████╗ ██████╗ ███╗   ███╗███╗   ██╗██╗
             ██╔═══██╗██╔══██╗████╗ ████║████╗  ██║██║
             ██║   ██║██████╔╝██╔████╔██║██╔██╗ ██║██║
             ██║   ██║██╔══██╗██║╚██╔╝██║██║╚██╗██║██║
             ╚██████╔╝██████╔╝██║ ╚═╝ ██║██║ ╚████║██║
              ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝
    `))
    console.log(chalk.gray('  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.gray('  ┃') + chalk.bold.white('          ꪶ ⌬ ꫂ | ʙᴏᴛ — ᴏғғɪᴄɪᴀʟ ᴠᴇʀsɪᴏɴ         ') + chalk.gray('┃'))
    console.log(chalk.gray('  ┃') + chalk.cyan('  ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴍʀ.ᴋɪᴡɪ') + chalk.gray(' • ') + chalk.white('ᴇɴɢɪɴᴇ: ʀᴇᴀʟᴠᴀʀᴇ      ') + chalk.gray('┃'))
    console.log(chalk.gray('  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'))
}

async function startBot() {
    const authFolder = './sessione'
    const { state, saveCreds } = await useMultiFileAuthState(authFolder)
    const { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' })),
        },
        browser: Browsers.macOS('Safari'),
        syncFullHistory: false,
        connectTimeoutMs: 60000,
    })

    // --- GESTIONE CONNESSIONE INIZIALE ---
    if (!state.creds.registered && !fs.existsSync(path.join(authFolder, 'creds.json'))) {
        printBanner()
        console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Come vuoi collegare il Bot?'))
        console.log(chalk.gray('┃  ') + chalk.cyan('[ 1 ]') + chalk.white(' QR Code'))
        console.log(chalk.gray('┃  ') + chalk.cyan('[ 2 ]') + chalk.white(' Pairing Code'))
        const opzione = await question(chalk.gray('└──╼ $ ') + chalk.white('Scelta: '))

        if (opzione === '2') {
            const num = await question(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~]\n└──╼ $ ') + chalk.white('Numero (es. 39...): '))
            const cleanNum = num.replace(/[^0-9]/g, '')
            
            console.log(chalk.gray('  >> ') + chalk.white('Generazione codice in corso...'))
            setTimeout(async () => {
                try {
                    let code = await conn.requestPairingCode(cleanNum)
                    const fmt = code?.match(/.{1,4}/g)?.join('-') || code
                    console.log()
                    console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Codice Pairing:'))
                    console.log(chalk.gray('┃  ') + chalk.bgCyan.black.bold('  ' + fmt + '  '))
                    console.log(chalk.gray('└──╼ $ ') + chalk.gray('Inseriscilo su WhatsApp dispositivo collegato'))
                } catch (e) { console.log(chalk.red('  ✗ Errore: ' + e.message)) }
            }, 5000)
        }
    }

    conn.ev.on('creds.update', saveCreds)

    // --- CARICAMENTO PLUGIN (ESM) ---
    const pluginsFolder = path.join(process.cwd(), 'plugins')
    global.plugins = {}
    if (fs.existsSync(pluginsFolder)) {
        const files = fs.readdirSync(pluginsFolder).filter(f => f.endsWith('.js'))
        for (let file of files) {
            try {
                const pluginPath = pathToFileURL(path.join(pluginsFolder, file)).href
                const plugin = await import(pluginPath + '?v=' + Date.now())
                global.plugins[file] = plugin.default || plugin
            } catch (e) { console.log(chalk.red(`  ✗ Errore caricamento [${file}]: ${e.message}`)) }
        }
    }

    // --- HANDLER MESSAGGI ---
    conn.ev.on('messages.upsert', async (chatUpdate) => {
        const m = chatUpdate.messages[0]
        if (!m.message || m.key.fromMe) return
        
        const from = m.key.remoteJid
        const sender = m.key.participant || from
        const body = m.message.conversation || m.message.extendedTextMessage?.text || m.message.imageMessage?.caption || ""
        
        const prefix = "."
        if (!body.startsWith(prefix)) return
        
        const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)

        const pluginFile = `${command}.js`
        if (global.plugins[pluginFile]) {
            try {
                let db = JSON.parse(fs.readFileSync(dbPath))
                await global.plugins[pluginFile].execute(conn, m, from, args, db, sender)
                
                db.totalCommands = (db.totalCommands || 0) + 1
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
                
                // Bio dinamica
                await conn.updateProfileStatus(`ꪶ ⌬ ꫂ | Comandi: ${db.totalCommands} | Dev: Mr. Kiwi 🥝`)
            } catch (e) { console.error(chalk.red('[ COMMAND ERROR ]'), e) }
        }
    })

    // --- STATUS CONNESSIONE ---
    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'connecting') {
            console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~]\n└──╼ $ ') + chalk.yellow('Connessione in corso...'))
        }
        if (connection === 'open') {
            printBanner()
            console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~]'))
            console.log(chalk.gray('┃  ') + chalk.green('✓ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE'))
            console.log(chalk.gray('┃  ') + chalk.white('Engine: ') + chalk.cyan('Realvare'))
            console.log(chalk.gray('┃  ') + chalk.white('Prefix: ') + chalk.red('.'))
            console.log(chalk.gray('└──╼ $ ') + chalk.white('In attesa di nuovi messaggi...\n'))
        }
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if (reason !== DisconnectReason.loggedOut) {
                console.log(chalk.yellow('  ⚡ Connessione persa, riavvio...'))
                startBot()
            } else {
                console.log(chalk.red('  ✗ Sessione terminata. Elimina la cartella sessione e riavvia.'))
            }
        }
    })

    return conn
}

startBot()

