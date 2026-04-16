const fs = require('fs');
module.exports = {
    execute: async (sock, mek, from, args, db) => {
        const text = args.join(" ");
        if (!text) return sock.sendMessage(from, { text: "｢ ❓ ｣ Esempio: `.setwelcome Ciao @user, benvenuto in @group`" });
        db.welcome = text;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        sock.sendMessage(from, { text: "｢ ✅ ｣ Messaggio di Benvenuto salvato!" });
    }
};

