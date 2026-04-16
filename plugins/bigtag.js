const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args) => {
        const textToTag = args[0];
        const count = parseInt(args[1]);

        if (!textToTag || isNaN(count)) {
            return sock.sendMessage(from, { text: "｢ ❓ ｣ Usa: `.bigtag [testo] [numero]`\nEsempio: `.bigtag sveglia 10`" });
        }

        // Limite di sicurezza per evitare il crash del bot o ban immediato
        const safeCount = Math.min(count, 100); 

        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants.map(a => a.id);

        await sock.sendMessage(from, { text: `｢ 📢 ｣ **ʙɪɢ_ᴛᴀɢ_ɪɴɪᴛɪᴀᴛᴇᴅ**\nInvio di ${safeCount} messaggi in corso...` });

        for (let i = 0; i < safeCount; i++) {
            await sock.sendMessage(from, { 
                text: `${textToTag}`, 
                mentions: participants 
            });
            // Piccolo delay per non intasare i server WhatsApp
            await sleep(500); 
        }
    }
};

