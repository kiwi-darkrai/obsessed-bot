const fs = require('fs');
module.exports = {
    adminOnly: true,
    execute: async (sock, mek, from, args, db) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (mek.message.extendedTextMessage?.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.participant : null);
        
        if (!target) return sock.sendMessage(from, { text: "｢ ⚠ ｣ Tagga o rispondi a qualcuno per mutarlo." });

        if (!db.mutedUsers[from]) db.mutedUsers[from] = [];
        if (!db.mutedUsers[from].includes(target)) {
            db.mutedUsers[from].push(target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        }

        sock.sendMessage(from, { text: `｢ 🔇 ｣ @${target.split('@')[0]} è stato mutato. Ogni suo messaggio verrà eliminato.`, mentions: [target] });
    }
};

