module.exports = {
    execute: async (sock, mek, from, args) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (mek.message.extendedTextMessage?.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.participant : null);
        if (!target) return sock.sendMessage(from, { text: "｢ ⚠ ｣ Tagga qualcuno da espellere." });
        await sock.groupParticipantsUpdate(from, [target], "remove");
        sock.sendMessage(from, { text: `｢ 🚪 ｣ Utente rimosso dal gruppo.` });
    }
};

