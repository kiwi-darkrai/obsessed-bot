export default {
    execute: async (conn, m, from) => {
        const res = await fetch('https://meme-api.com/gimme').then(r => r.json());
        await conn.sendMessage(from, { image: { url: res.url }, caption: `｢ 🤣 ｣ **${res.title}**` });
    }
};

