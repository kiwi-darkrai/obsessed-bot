const fs = require('fs');
export default {
    adminOnly: true,
    execute: async (conn, m, from, args, db) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (m.message.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo.participant : null);
        
        if (!target) return conn.sendMessage(from, { text: "｢ ⚠ ｣ Tagga chi vuoi smutare." });

        if (db.mutedUsers[from]) {
            db.mutedUsers[from] = db.mutedUsers[from].filter(id => id !== target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        }

        conn.sendMessage(from, { text: `｢ 🔊 ｣ @${target.split('@')[0]} può di nuovo parlare.`, mentions: [target] });
    }
};

