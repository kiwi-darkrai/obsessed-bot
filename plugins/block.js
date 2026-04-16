module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || args[0] + "@s.whatsapp.net";
        await sock.updateBlockStatus(target, "block");
        sock.sendMessage(from, { text: `｢ 🚫 ｣ Utente bloccato globalmente dal Bot.` });
    }
};

