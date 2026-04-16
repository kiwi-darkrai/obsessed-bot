import fs from "fs";
export default {
    ownerOnly: true,
    execute: async (conn, m, from, args, db) => {
        let target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0];
        if (!target) return conn.sendMessage(from, { text: "｢ ⚠ ｣ Tagga l'owner da rimuovere." });
        
        db.owners = db.owners.filter(o => o !== target);
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        conn.sendMessage(from, { text: "｢ 🗑️ ｣ Owner rimosso dai privilegi di sistema." });
    }
};

