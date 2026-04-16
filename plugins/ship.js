module.exports = {
    execute: async (sock, mek, from, args) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid;
        if (!target || target.length < 2) return sock.sendMessage(from, { text: "Tagga due persone!" });
        const love = Math.floor(Math.random() * 101);
        const style = `｢ ❤️ ｣ **ʟᴏᴠᴇ_ᴍᴇᴛᴇʀ**\n\n@${target[0].split('@')[0]} + @${target[1].split('@')[0]}\n**ᴘᴇʀᴄᴇɴᴛᴜᴀʟᴇ:** ${love}%\n\n${love > 70 ? 'Una coppia perfetta! ✨' : 'Forse meglio restare amici. ☕'}`;
        sock.sendMessage(from, { text: style, mentions: target });
    }
};

