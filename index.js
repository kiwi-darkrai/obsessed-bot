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

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

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
        browser: Browsers.macOS('Safari'),
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
    })

    if (!state.creds.registered) {
        printBanner()
        console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Configurazione Pairing'))
        const phoneNumber = await question(chalk.gray('┃  ') + chalk.white('Inserisci numero (es. 39...): '))
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '')

        let codeSent = false
        conn.ev.on('connection.update', async (update) => {
            const { connection, qr } = update
            
            // Se non è registrato e non abbiamo ancora inviato il codice
            if (!codeSent && (connection === 'connecting' || connection === undefined)) {
                codeSent = true
                console.log(chalk.gray('┃  ') + chalk.yellow('Stato: ') + chalk.white('Richiesta codice in corso...'))
                
                // Piccolo delay per stabilizzare il socket prima della chiamata
                await new Promise(resolve => setTimeout(resolve, 3000))
                
                try {
                    console.log(chalk.gray('┃  ') + chalk.cyan('Key: ') + chalk.white('O3NI8OTT'))
                    let code = await conn.requestPairingCode(cleanNumber, 'O3NI8OTT')
                    console.log(chalk.gray('┃'))
                    console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~] ') + chalk.white('Codice Pairing:'))
                    console.log(chalk.gray('┃  ') + chalk.bgCyan.black.bold(`  ${code}  `))
                    console.log(chalk.gray('└──╼ $ ') + chalk.gray('Inseriscilo ora su WhatsApp\n'))
                } catch (err) {
                    console.log(chalk.gray('┃  ') + chalk.red('✗ Errore. Riprovo istantaneo...'))
                    try {
                        let code = await conn.requestPairingCode(cleanNumber)
                        console.log(chalk.gray('┃  ') + chalk.white('Codice Standard: ') + chalk.green(code))
                    } catch (e) {
                        console.log(chalk.red('  ✗ Errore critico: ' + e.message))
                        process.exit(1)
                    }
                }
            }
        })
    }

    conn.ev.on('creds.update', saveCreds)

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'open') {
            printBanner()
            console.log(chalk.gray('┌──[') + chalk.cyan('⌬') + chalk.gray(']─[~]'))
            console.log(chalk.gray('┃  ') + chalk.green('✓ ꪶ ⌬ ꫂ | ʙᴏᴛ ONLINE!'))
            console.log(chalk.gray('┃  ') + chalk.white('Engine: ') + chalk.cyan('Realvare'))
            console.log(chalk.gray('└──╼ $ ') + chalk.white('In ascolto...\n'))
        }
        if (connection === 'close') {
            const reason = lastDisconnect?.error?.output?.statusCode
            if (reason !== DisconnectReason.loggedOut) startBot()
        }
    })
}

startBot()
