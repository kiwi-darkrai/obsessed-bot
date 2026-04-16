import pkg from '@realvare/baileys'
const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    Browsers
} = pkg
import pino from 'pino'
import fs from 'fs'
import chalk from 'chalk'
import readline from 'readline'

const printBanner = () => {
    console.clear()
    console.log(chalk.cyan(`
      ::::::::   :::   :::  ::::    ::: ::::::::::: 
     :+:    :+:  :+:+: :+:+: :+:+:   :+:     :+:      
     +:+    +:+ +:+ +:+  +:+ :+:+:+  +:+     +:+      
     +#+    +:+ +#+  +:+  +#+ +#+ +:+ +#+     +#+      
     +#+    +#+ +#+       +#+ +#+  +#+#+#     +#+      
     #+#    #+# #+#       #+# #+#   #+#+#     #+#      
      ########  ###       ### ###    ####     ###      
    `))
    console.log(chalk.gray('  ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.gray('  ┃') + chalk.bold.white('          ꪶ ⌬ ꫂ | ʙᴏᴛ — ᴏғғɪᴄɪᴀʟ ᴠᴇʀsɪᴏɴ         ') + chalk.gray('┃'))
    console.log(chalk.gray('  ┃') + chalk.cyan('  ᴅᴇᴠᴇʟᴏᴘᴇᴅ ʙʏ ᴍʀ.ᴋɪᴡɪ') + chalk.gray(' • ') + chalk.white('ᴇɴɢɪɴᴇ: ʀᴇᴀʟᴠᴀʀᴇ      ') + chalk.gray('┃'))
    console.log(chalk.gray('  ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n'))
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessione')
    const { version } = await fetchLatestBaileysVersion()

    const conn = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: Browsers.ubuntu('Chrome'),
        connectTimeoutMs: 60000,
    })

    if (!state.creds.registered) {
        printBanner()
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
        
        console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Configurazione Pairing'))
        
        const num = await new Promise(resolve => {
            rl.question(chalk.gray('┃  ') + chalk.white('Inserisci numero: '), resolve)
        })
        
        rl.close()
        const cleanNumber = num.replace(/[^0-9]/g, '')
        
        console.log(chalk.gray('┃  ') + chalk.yellow('Stato: ') + chalk.white('Connessione in corso...'))

        // TRUCCO: Aspettiamo l'evento 'creds.update' o un timer per essere sicuri che il socket sia pronto
        setTimeout(async () => {
            try {
                console.log(chalk.gray('┃  ') + chalk.cyan('Richiesta: ') + chalk.white('O3NI8OTT'))
                const code = await conn.requestPairingCode(cleanNumber, 'O3NI8OTT')
                console.log(chalk.gray('┃'))
                console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Codice Pairing:'))
                console.log(chalk.gray('┃  ') + chalk.bgCyan.black.bold(`  ${code}  `))
                console.log(chalk.gray('└──╼ $ ') + chalk.gray('Inseriscilo ora su WhatsApp\n'))
            } catch (e) {
                console.log(chalk.gray('┃  ') + chalk.red('✗ Fallito. Provo standard...'))
                const code = await conn.requestPairingCode(cleanNumber)
                console.log(chalk.gray('┃  ') + chalk.green('Codice: ' + code))
            }
        }, 10000) // 10 secondi pieni. Non avere fretta, serve a stabilizzare il tunnel TCP.
    }

    conn.ev.on('creds.update', saveCreds)
    conn.ev.on('connection.update', (u) => {
        if (u.connection === 'open') {
            printBanner()
            console.log(chalk.green('✓ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE!\n'))
        }
        if (u.connection === 'close' && u.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) startBot()
    })
}

startBot()
