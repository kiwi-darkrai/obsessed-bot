import fs from "fs";
export default {
    execute: async (conn, m, from, args, db) => {
        const text = args.join(" ");
        if (!text) return conn.sendMessage(from, { text: "｢ ❓ ｣ Esempio: `.setbye Addio @user, ci mancherai!`" });
        db.goodbye = text;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        conn.sendMessage(from, { text: "｢ ✅ ｣ Messaggio di Addio salvato!" });
    }
};

