const fs = require('fs');
module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args, db) => {
        let target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0];
        if (!target) return sock.sendMessage(from, { text: "｢ ⚠ ｣ Tagga l'owner da rimuovere." });
        
        db.owners = db.owners.filter(o => o !== target);
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        sock.sendMessage(from, { text: "｢ 🗑️ ｣ Owner rimosso dai privilegi di sistema." });
    }
};

