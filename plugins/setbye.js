const fs = require('fs');
module.exports = {
    execute: async (sock, mek, from, args, db) => {
        const text = args.join(" ");
        if (!text) return sock.sendMessage(from, { text: "｢ ❓ ｣ Esempio: `.setbye Addio @user, ci mancherai!`" });
        db.goodbye = text;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        sock.sendMessage(from, { text: "｢ ✅ ｣ Messaggio di Addio salvato!" });
    }
};

