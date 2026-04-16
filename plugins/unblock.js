export default {
    ownerOnly: true,
    execute: async (conn, m, from, args) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || args[0] + "@s.whatsapp.net";
        await conn.updateBlockStatus(target, "unblock");
        conn.sendMessage(from, { text: `｢ ✅ ｣ Utente sbloccato.` });
    }
};

