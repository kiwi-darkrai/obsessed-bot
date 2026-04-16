export default {
    ownerOnly: true,
    execute: async (conn, m, from, args, db) => {
        if (!db.backups || !db.backups[from]) {
            return conn.sendMessage(from, { text: "｢ ❌ ｣ Nessun backup trovato per questo gruppo." });
        }

        const originalName = db.backups[from].name;
        await conn.groupUpdateSubject(from, originalName);
        await conn.groupSettingUpdate(from, 'not_announcement'); // Tutti scrivono

        conn.sendMessage(from, { text: `｢ 🛡️ ｣ **ꜱʏꜱᴛᴇᴍ_ʀᴇꜱᴛᴏʀᴇᴅ**\n\nNome originale: ${originalName}\nStato: Operativo.` });
    }
};

