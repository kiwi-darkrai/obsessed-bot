module.exports = {
    execute: async (sock, mek, from, args) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (mek.message.extendedTextMessage?.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.participant : null);
        if (!target) return sock.sendMessage(from, { text: "｢ ⚠ ｣ Tagga o rispondi a un utente." });
        await sock.groupParticipantsUpdate(from, [target], "promote");
        sock.sendMessage(from, { text: `｢ ✅ ｣ Utente promosso ad Admin.` });
    }
};

