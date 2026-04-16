const fs = require('fs');
export default {
    ownerOnly: true,
    execute: async (conn, m, from, args, db) => {
        let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0];
        if (!target) return conn.sendMessage(from, { text: "Tagga l'utente da aggiungere." });
        
        if (!db.owners.includes(target)) {
            db.owners.push(target);
            fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
            conn.sendMessage(from, { text: "｢ ✅ ｣ Nuovo Owner aggiunto con successo." });
        }
    }
};

