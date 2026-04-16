import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');

export default {
    execute: async (conn, m, from, args, db, sender) => {
        const infoText = `ꪶ ⌬ ꫂ | ʙᴏᴛ — ɪɴғᴏ\n\nOwner: @27833368862\nComandi eseguiti: ${db.totalCommands || 0}`;
        await conn.sendMessage(from, { text: infoText }, { quoted: m });
    }
}
