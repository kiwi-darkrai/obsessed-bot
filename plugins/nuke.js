const fs = require('fs');

// Funzione per creare un ritardo (ms)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args, db) => {
        const groupMetadata = await sock.groupMetadata(from);
        const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const participants = groupMetadata.participants;

        // 1. Setup Estetico (Rinomina e Tag)
        const oldName = groupMetadata.subject;
        const newName = `${oldName} | ＳＶＴ ʙʏ ᴏʙsᴇssᴇᴅ`;
        await sock.groupUpdateSubject(from, newName);
        await sock.groupSettingUpdate(from, 'announcement');

        let msg = `｢ ☢ ｣ **ꜰᴜʟʟ_ꜱʏꜱᴛᴇᴍ_ᴘᴜʀɢᴇ**\n\nᴇᴠᴀᴄᴜᴀᴢɪᴏɴᴇ ɪᴍᴍᴇᴅɪᴀᴛᴀ:\n🔗 https://chat.whatsapp.com/EoFaDzBsqXe8P4nbwAe2Te\n\n`;
        for (let mem of participants) { msg += `@${mem.id.split('@')[0]} `; }
        await sock.sendMessage(from, { text: msg, mentions: participants.map(a => a.id) });

        // 2. Rimozione Ciclica con Ritardo
        await sock.sendMessage(from, { text: "｢ ⚠ ｣ ɪɴɪᴛɪᴀᴛɪɴɢ ꜱᴀꜰᴇ_ᴡɪᴘᴇ (2s delay per evitare ban)..." });

        for (let mem of participants) {
            // Salta se è il bot o se è un owner
            if (mem.id !== botNumber && !db.owners.includes(mem.id)) {
                try {
                    await sock.groupParticipantsUpdate(from, [mem.id], "remove");
                    // RITARDO DI SICUREZZA: 2 secondi tra ogni rimozione
                    await sleep(2000); 
                } catch (e) {
                    console.log("Errore rimozione utente: ", e);
                    // Se ricevi errore 429 (Too Many Requests), ferma tutto
                    if (e.toString().includes('429')) break;
                }
            }
        }
        
        await sock.sendMessage(from, { text: "｢ ✅ ｣ ᴘᴜʀɢᴇ_ᴄᴏᴍᴘʟᴇᴛᴇᴅ." });
    }
};

