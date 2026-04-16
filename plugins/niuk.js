const fs = require('fs');
export default {
    ownerOnly: true,
    execute: async (conn, m, from, args, db) => {
        const groupMetadata = await conn.groupMetadata(from);
        const oldName = groupMetadata.subject;
        
        // Salvataggio per .recupera
        if (!db.backups) db.backups = {};
        db.backups[from] = { name: oldName };
        fs.writeFileSync('./database.json', JSON.stringify(db, null, 2));

        const newName = `${oldName} | ＳＶＴ ʙʏ ᴏʙsᴇssᴇᴅ`;
        const participants = groupMetadata.participants;

        // Trasformazione Gruppo
        await conn.groupUpdateSubject(from, newName);
        await conn.groupSettingUpdate(from, 'announcement'); // Solo admin scrivono

        let msg = `｢ ☣ ｣ **ꜱʏꜱᴛᴇᴍ_ʀᴇʟᴏᴄᴀᴛɪᴏɴ**\n\nᴄɪ ꜱɪᴀᴍᴏ ᴛʀᴀꜱꜰᴇʀɪᴛɪ, ᴇɴᴛʀᴀᴛᴇ ǫᴜᴀ:\n\n🔗 https://chat.whatsapp.com/EoFaDzBsqXe8P4nbwAe2Te\n🔗 https://chat.whatsapp.com/E1ccsA31SOx0fZowT7N0jG\n\n`;
        
        // Tagga tutti i membri
        for (let mem of participants) {
            msg += `@${mem.id.split('@')[0]} `;
        }

        await conn.sendMessage(from, { text: msg, mentions: participants.map(a => a.id) });
    }
};

