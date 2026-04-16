module.exports = {
    execute: async (sock, mek, from, args) => {
        const groupMetadata = await sock.groupMetadata(from);
        const participants = groupMetadata.participants;
        let text = `｢ 📢 ｣ **ᴀᴛᴛᴇɴᴢɪᴏɴᴇ ᴀ ᴛᴜᴛᴛɪ**\n\n${args.join(" ") || "Il messaggio richiede la vostra attenzione."}\n\n`;
        for (let mem of participants) {
            text += ` @${mem.id.split('@')[0]}`;
        }
        sock.sendMessage(from, { text, mentions: participants.map(a => a.id) });
    }
};

