export default {
    execute: async (conn, m, from, args) => {
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        let text = `｢ 📢 ｣ **ᴀᴛᴛᴇɴᴢɪᴏɴᴇ ᴀ ᴛᴜᴛᴛɪ**\n\n${args.join(" ") || "Il messaggio richiede la vostra attenzione."}\n\n`;
        for (let mem of participants) {
            text += ` @${mem.id.split('@')[0]}`;
        }
        conn.sendMessage(from, { text, mentions: participants.map(a => a.id) });
    }
};

