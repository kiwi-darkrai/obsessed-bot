const fs = require('fs');
module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args, db) => {
        let target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0];
        if (!target) return sock.sendMessage(from, { text: "Tagga l'utente da aggiungere." });
        
        if (!db.owners.includes(target)) {
            db.owners.push(target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
            sock.sendMessage(from, { text: "｢ ✅ ｣ Nuovo Owner aggiunto con successo." });
        }
    }
};

