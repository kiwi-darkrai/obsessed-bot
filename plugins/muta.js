const fs = require('fs');
export default {
    adminOnly: true,
    execute: async (conn, m, from, args, db) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (m.message.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null);
        
        if (!target) return conn.sendMessage(from, { text: "｢ ⚠ ｣ Tagga o rispondi a qualcuno per mutarlo." });

        if (!db.mutedUsers[from]) db.mutedUsers[from] = [];
        if (!db.mutedUsers[from].includes(target)) {
            db.mutedUsers[from].push(target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        }

        conn.sendMessage(from, { text: `｢ 🔇 ｣ @${target.split('@')[0]} è stato mutato. Ogni suo messaggio verrà eliminato.`, mentions: [target] });
    }
};

