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

// Caricamento database
const dbPath = './database.json'
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ owners: ["27833368862@s.whatsapp.net"], totalCommands: 0 }, null, 2))
}

const printBanner = () => {
    console.clear()
    console.log(chalk.red([
        '',
        '███╗   ██╗██╗██╗  ██╗ █████╗ ██████╗  ██████╗ ████████╗',
        '████╗  ██║██║██║ ██╔╝██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝',
        '██╔██╗ ██║██║█████╔╝ ███████║██████╔╝██║   ██║   ██║   ',
        '██║╚██╗██║██║██╔═██╗ ██╔══██║██╔══██╗██║   ██║   ██║   ',
        '██║ ╚████║██║██║  ██╗██║  ██║██████╔╝╚██████╔╝   ██║   ',
        '╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝    ╚═╝   ',
        '',
        '                              by Mr.Kiwi',
    ].join('\n')))
    console.log(chalk.gray('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.gray('┃') + chalk.white('  ꪶ ⌬ ꫂ | ʙᴏᴛ • Realvare Engine • by Mr.Kiwi    ') + chalk.gray('┃'))
    console.log(chalk.gray('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'))
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

    if (!state.creds.registered && !fs.existsSync(path.join(authFolder, 'creds.json'))) {
        printBanner()
        console.log(chalk.gray('┌──[') + chalk.red('⌬') + chalk.gray(']─[~] ') + chalk.white('Scegli connessione:'))
        console.log(chalk.gray('┃  [ 1 ] QR Code\n┃  [ 2 ] Pairing Code'))
        const opzione = await question(chalk.gray('└──╼ $ ') + chalk.white('Scelta: '))

        if (opzione === '2') {
            const num = await question(chalk.gray('┌──[') + chalk.red('⌬') + chalk.gray(']─[~]\n└──╼ $ ') + chalk.white('Numero (es. 39...): '))
            const cleanNum = num.replace(/[^0-9]/g, '')
            
            setTimeout(async () => {
                try {
                    let code = await conn.requestPairingCode(cleanNum)
                    const fmt = code?.match(/.{1,4}/g)?.join('-') || code
                    console.log()
                    console.log(chalk.gray('┌──[') + chalk.red('⌬') + chalk.gray(']─[~] ') + chalk.white('Codice:'))
                    console.log(chalk.gray('┃  ') + chalk.bgRed.white.bold('  ' + fmt + '  '))
                    console.log(chalk.gray('└──╼ $ ') + chalk.gray('Inseriscilo su WhatsApp'))
                } catch (e) { console.log(chalk.red('  ✗ Errore pairing: ' + e.message)) }
            }, 3000)
        }
    }

    conn.ev.on('creds.update', saveCreds)

    // Caricamento plugin (ESM)
    const pluginsFolder = path.join(process.cwd(), 'plugins')
    global.plugins = {}
    if (fs.existsSync(pluginsFolder)) {
        const files = fs.readdirSync(pluginsFolder).filter(f => f.endsWith('.js'))
        for (let file of files) {
            try {
                const pluginPath = pathToFileURL(path.join(pluginsFolder, file)).href
                const plugin = await import(pluginPath + '?v=' + Date.now())
                global.plugins[file] = plugin.default || plugin
            } catch (e) { console.log(chalk.red(`  ✗ [${file}]: ${e.message}`)) }
        }
    }

    conn.ev.on('messages.upsert', async (chatUpdate) => {
        const m = chatUpdate.messages[0]
        if (!m.message || m.key.fromMe) return
        
        const from = m.key.remoteJid
        const sender = m.key.participant || from
        const body = m.message.conversation || m.message.extendedTextMessage?.text || ""
        
        if (!body.startsWith('.')) return
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const args = body.trim().split(/ +/).slice(1)

        const pluginFile = `${command}.js`
        if (global.plugins[pluginFile]) {
            try {
                const db = JSON.parse(fs.readFileSync(dbPath))
                await global.plugins[pluginFile].execute(conn, m, from, args, db, sender)
                
                db.totalCommands = (db.totalCommands || 0) + 1
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2))
                await conn.updateProfileStatus(`ꪶ ⌬ ꫂ | Comandi: ${db.totalCommands} | Dev: Mr. Kiwi 🥝`)
            } catch (e) { console.error(chalk.red('[ CMD ERROR ]'), e) }
        }
    })

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'connecting') console.log(chalk.yellow('  ⚡ Connessione in corso...'))
        if (connection === 'open') {
            printBanner()
            console.log(chalk.gray('┌──[') + chalk.red('⌬') + chalk.gray(']─[~]'))
            console.log(chalk.gray('┃  ') + chalk.green('✓ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE'))
            console.log(chalk.gray('┃  ') + chalk.white('Motore: ') + chalk.red('Realvare/Baileys'))
            console.log(chalk.gray('┃  ') + chalk.white('Plugin: ') + chalk.red(Object.keys(global.plugins).length))
            console.log(chalk.gray('└──╼ $ ') + chalk.white('Pronto per i comandi.\n'))
        }
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if (reason !== DisconnectReason.loggedOut) startBot()
        }
    })

    return conn
}

startBot()

