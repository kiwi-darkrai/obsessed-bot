import fs from "fs";
export default {
    execute: async (conn, m, from, args, db, sender) => {
        const gen = args[0]?.toLowerCase();
        if (gen !== 'maschio' && gen !== 'femmina') {
            return conn.sendMessage(from, { text: "｢ ❓ ｣ Usa: `.setgenere maschio` o `.setgenere femmina`" });
        }
        if (!db.users[sender]) db.users[sender] = {};
        db.users[sender].genere = gen;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        conn.sendMessage(from, { text: `｢ ✅ ｣ Genere impostato su: ${gen.toUpperCase()}` });
    }
};

