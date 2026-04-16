export default {
    execute: async (conn, m, from, args, db, sender) => {
        conn.sendMessage(from, { text: `｢ 💔 ｣ @${sender.split('@')[0]} ha firmato le carte del divorzio. È di nuovo sulla piazza!`, mentions: [sender] });
    }
};

