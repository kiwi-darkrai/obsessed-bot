export default {
    execute: async (conn, m, from, args) => {
        const groupMetadata = await conn.groupMetadata(from);
        conn.sendMessage(from, { 
            text: args.join(" ") || "Avviso di sistema.", 
            mentions: groupMetadata.participants.map(a => a.id) 
        });
    }
};

