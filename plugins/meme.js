module.exports = {
    execute: async (sock, mek, from) => {
        const res = await fetch('https://meme-api.com/gimme').then(r => r.json());
        await sock.sendMessage(from, { image: { url: res.url }, caption: `｢ 🤣 ｣ **${res.title}**` });
    }
};

