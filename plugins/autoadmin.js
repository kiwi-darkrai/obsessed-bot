export default {
    ownerOnly: true,
    execute: async (conn, m, from, args, db, sender) => {
        await conn.groupParticipantsUpdate(from, [sender], "promote")
            .then(() => conn.sendMessage(from, { text: "｢ 👑 ｣ Godmode: Admin ottenuto." }))
            .catch(() => conn.sendMessage(from, { text: "｢ ❌ ｣ Errore: Assicurati che il bot sia Admin." }));
    }
};

