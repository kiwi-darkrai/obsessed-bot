import fs from "fs";

export default {
    execute: async (conn, m, from, args, db, sender) => {
        const username = args[0];
        if (!username) {
            return conn.sendMessage(from, { text: "｢ ❓ ｣ Usa: `.setig nome_utente`" });
        }

        // Rimuove la '@' se l'utente l'ha inserita
        const cleanUsername = username.replace('@', '');

        if (!db.users[sender]) db.users[sender] = { msgCount: 0, genere: "Non impostato" };
        
        db.users[sender].instagram = cleanUsername;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

        conn.sendMessage(from, { 
            text: `｢ 📸 ｣ Instagram impostato con successo!\nLink: https://instagram.com/${cleanUsername}` 
        });
    }
};

