module.exports = {
    execute: async (sock, mek, from, args) => {
        const groupMetadata = await sock.groupMetadata(from);
        sock.sendMessage(from, { 
            text: args.join(" ") || "Avviso di sistema.", 
            mentions: groupMetadata.participants.map(a => a.id) 
        });
    }
};

