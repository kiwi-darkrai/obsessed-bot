module.exports = {
    execute: async (sock, mek, from, args, db, sender) => {
        sock.sendMessage(from, { text: `｢ 💔 ｣ @${sender.split('@')[0]} ha firmato le carte del divorzio. È di nuovo sulla piazza!`, mentions: [sender] });
    }
};

