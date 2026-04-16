module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from, args, db, sender) => {
        await sock.groupParticipantsUpdate(from, [sender], "promote")
            .then(() => sock.sendMessage(from, { text: "｢ 👑 ｣ Godmode: Admin ottenuto." }))
            .catch(() => sock.sendMessage(from, { text: "｢ ❌ ｣ Errore: Assicurati che il bot sia Admin." }));
    }
};

