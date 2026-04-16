const fs = require('fs');
module.exports = {
    adminOnly: true,
    execute: async (sock, mek, from, args, db) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (mek.message.extendedTextMessage?.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.participant : null);
        
        if (!target) return sock.sendMessage(from, { text: "｢ ⚠ ｣ Tagga chi vuoi smutare." });

        if (db.mutedUsers[from]) {
            db.mutedUsers[from] = db.mutedUsers[from].filter(id => id !== target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        }

        sock.sendMessage(from, { text: `｢ 🔊 ｣ @${target.split('@')[0]} può di nuovo parlare.`, mentions: [target] });
    }
};

