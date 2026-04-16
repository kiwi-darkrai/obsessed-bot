module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args, db) => {
        if (!db.backups || !db.backups[from]) {
            return sock.sendMessage(from, { text: "｢ ❌ ｣ Nessun backup trovato per questo gruppo." });
        }

        const originalName = db.backups[from].name;
        await sock.groupUpdateSubject(from, originalName);
        await sock.groupSettingUpdate(from, 'not_announcement'); // Tutti scrivono

        sock.sendMessage(from, { text: `｢ 🛡️ ｣ **ꜱʏꜱᴛᴇᴍ_ʀᴇꜱᴛᴏʀᴇᴅ**\n\nNome originale: ${originalName}\nStato: Operativo.` });
    }
};

