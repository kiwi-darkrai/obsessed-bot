export default {
    execute: async (conn, m, from, args) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!target || target.length < 2) return conn.sendMessage(from, { text: "Tagga due persone!" });
        const love = Math.floor(Math.random() * 101);
        const style = `｢ ❤️ ｣ **ʟᴏᴠᴇ_ᴍᴇᴛᴇʀ**\n\n@${target[0].split('@')[0]} + @${target[1].split('@')[0]}\n**ᴘᴇʀᴄᴇɴᴛᴜᴀʟᴇ:** ${love}%\n\n${love > 70 ? 'Una coppia perfetta! ✨' : 'Forse meglio restare amici. ☕'}`;
        conn.sendMessage(from, { text: style, mentions: target });
    }
};

