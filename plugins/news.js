const axios = require('axios');

export default {
    execute: async (conn, m, from, args) => {
        try {
            const res = await axios.get(`https://newsapi.org/v2/top-headlines?country=it&apiKey=229d71e449ab42b1b0ef07d5029e6c62`); // Registrati su newsapi.org per una key free
            const art = res.data.articles[0];

            const text = `
｢ 📰 ｣ **ᴜʟᴛɪᴍᴇ ɴᴏᴛɪᴢɪᴇ**
---------------------------
📌 **ᴛɪᴛᴏʟᴏ**: ${art.title}
🔗 **ʟɪɴᴋ**: ${art.url}
---------------------------`;

            conn.sendMessage(from, { text });
        } catch {
            conn.sendMessage(from, { text: "｢ ❌ ｣ Servizio news momentaneamente non disponibile." });
        }
    }
};

