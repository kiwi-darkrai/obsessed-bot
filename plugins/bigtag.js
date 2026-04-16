const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default {
    ownerOnly: true,
    execute: async (conn, m, from, args) => {
        const textToTag = args[0];
        const count = parseInt(args[1]);

        if (!textToTag || isNaN(count)) {
            return conn.sendMessage(from, { text: "｢ ❓ ｣ Usa: `.bigtag [testo] [numero]`\nEsempio: `.bigtag sveglia 10`" });
        }

        // Limite di sicurezza per evitare il crash del bot o ban immediato
        const safeCount = Math.min(count, 100); 

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants.map(a => a.id);

        await conn.sendMessage(from, { text: `｢ 📢 ｣ **ʙɪɢ_ᴛᴀɢ_ɪɴɪᴛɪᴀᴛᴇᴅ**\nInvio di ${safeCount} messaggi in corso...` });

        for (let i = 0; i < safeCount; i++) {
            await conn.sendMessage(from, { 
                text: `${textToTag}`, 
                mentions: participants 
            });
            // Piccolo delay per non intasare i server WhatsApp
            await sleep(500); 
        }
    }
};

