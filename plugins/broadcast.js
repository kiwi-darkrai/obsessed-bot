module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args) => {
        const groups = Object.keys(await sock.groupFetchAllParticipating());
        const msg = args.join(" ");
        if (!msg) return sock.sendMessage(from, { text: "Inserisci il messaggio da trasmettere." });
        
        for (let i of groups) {
            await sock.sendMessage(i, { text: `｢ 📡 ｣ **ʙʀᴏᴀᴅᴄᴀꜱᴛ_ᴍᴇꜱꜱᴀɢᴇ**\n\n${msg}` });
        }
        sock.sendMessage(from, { text: "｢ ✅ ｣ Messaggio inviato a tutti i gruppi." });
    }
};

