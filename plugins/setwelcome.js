import fs from "fs";
export default {
    execute: async (conn, m, from, args, db) => {
        const text = args.join(" ");
        if (!text) return conn.sendMessage(from, { text: "｢ ❓ ｣ Esempio: `.setwelcome Ciao @user, benvenuto in @group`" });
        db.welcome = text;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        conn.sendMessage(from, { text: "｢ ✅ ｣ Messaggio di Benvenuto salvato!" });
    }
};

