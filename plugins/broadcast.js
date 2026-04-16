export default {
    ownerOnly: true,
    execute: async (conn, m, from, args) => {
        const groups = Object.keys(await conn.groupFetchAllParticipating());
        const msg = args.join(" ");
        if (!msg) return conn.sendMessage(from, { text: "Inserisci il messaggio da trasmettere." });
        
        for (let i of groups) {
            await conn.sendMessage(i, { text: `｢ 📡 ｣ **ʙʀᴏᴀᴅᴄᴀꜱᴛ_ᴍᴇꜱꜱᴀɢᴇ**\n\n${msg}` });
        }
        conn.sendMessage(from, { text: "｢ ✅ ｣ Messaggio inviato a tutti i gruppi." });
    }
};

