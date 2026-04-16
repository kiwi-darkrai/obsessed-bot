export default {
    execute: async (conn, m, from, args) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (m.message.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null);
        if (!target) return conn.sendMessage(from, { text: "｢ ⚠ ｣ Tagga o rispondi a un utente." });
        await conn.groupParticipantsUpdate(from, [target], "demote");
        conn.sendMessage(from, { text: `｢ 🛡️ ｣ Privilegi admin rimossi.` });
    }
};

