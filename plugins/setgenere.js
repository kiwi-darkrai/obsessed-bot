const fs = require('fs');
module.exports = {
    execute: async (sock, mek, from, args, db, sender) => {
        const gen = args[0]?.toLowerCase();
        if (gen !== 'maschio' && gen !== 'femmina') {
            return sock.sendMessage(from, { text: "｢ ❓ ｣ Usa: `.setgenere maschio` o `.setgenere femmina`" });
        }
        if (!db.users[sender]) db.users[sender] = {};
        db.users[sender].genere = gen;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        sock.sendMessage(from, { text: `｢ ✅ ｣ Genere impostato su: ${gen.toUpperCase()}` });
    }
};

