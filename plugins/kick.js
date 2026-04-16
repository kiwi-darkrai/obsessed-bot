export default {
    execute: async (conn, m, from, args) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (m.message.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null);
        if (!target) return conn.sendMessage(from, { text: "｢ ⚠ ｣ Tagga qualcuno da espellere." });
        await conn.groupParticipantsUpdate(from, [target], "remove");
        conn.sendMessage(from, { text: `｢ 🚪 ｣ Utente rimosso dal gruppo.` });
    }
};

