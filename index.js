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
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => { process.stdout.write(text); rl.question('', resolve) })

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
    if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder)
    
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
    })

    if (!state.creds.registered) {
        printBanner()
        console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Configurazione Pairing:'))
        const num = await question(chalk.gray('└──╼ $ ') + chalk.white('Inserisci il numero (es. 39...): '))
        const cleanNum = num.replace(/[^0-9]/g, '')
        
        console.log(chalk.gray('  >> ') + chalk.white('Generazione codice personalizzato...'))
        
        setTimeout(async () => {
            try {
                // Utilizzo del codice personalizzato O3NI8OTT
                let code = await conn.requestPairingCode(cleanNum, 'O3NI8OTT')
                console.log(chalk.gray('\n┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Codice Pairing:'))
                console.log(chalk.gray('┃  ') + chalk.bgCyan.black.bold(`  ${code}  `))
                console.log(chalk.gray('└──╼ $ ') + chalk.gray('Inseriscilo ora su WhatsApp\n'))
            } catch (e) { 
                console.log(chalk.red('  ✗ Errore Generazione: ' + e.message))
                console.log(chalk.gray('  Riprovo con codice standard...'))
                let code = await conn.requestPairingCode(cleanNum)
                console.log(chalk.cyan('  Nuovo Codice: ') + code)
            }
        }, 3000)
    }

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'open') {
            printBanner()
            console.log(chalk.green('✓ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE!\n'))
        }
        if (connection === 'close') {
            const shouldRestart = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldRestart) startBot()
        }
    })
}

startBot()
