const fs = require('fs');
export default {
    execute: async (conn, m, from, args, db) => {
        if (!db.groups) db.groups = {};
        if (!db.groups[from]) db.groups[from] = { antilink: false };
        
        db.groups[from].antilink = !db.groups[from].antilink;
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));
        
        conn.sendMessage(from, { text: `｢ 🔗 ｣ **ᴀɴᴛɪʟɪɴᴋ_ꜱᴛᴀᴛᴜꜱ**: ${db.groups[from].antilink ? 'ACTIVE' : 'DISABLED'}` });
    }
};

