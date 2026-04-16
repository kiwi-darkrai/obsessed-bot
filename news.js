const axios = require('axios');

module.exports = {
    execute: async (sock, mek, from, args) => {
        try {
            const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=it&apiKey=229d71e449ab42b1b0ef07d5029e6c62`); // Registrati su newsapi.org per una key free
            const art = res.data.articles[0];

            const text = `
｢ 📰 ｣ **ᴜʟᴛɪᴍᴇ ɴᴏᴛɪᴢɪᴇ**
---------------------------
📌 **ᴛɪᴛᴏʟᴏ**: ${art.title}
🔗 **ʟɪɴᴋ**: ${art.url}
---------------------------`;

            sock.sendMessage(from, { text });
        } catch {
            sock.sendMessage(from, { text: "｢ ❌ ｣ Servizio news momentaneamente non disponibile." });
        }
    }
};

