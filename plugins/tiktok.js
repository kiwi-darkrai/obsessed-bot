const axios = require('axios');

export default {
    execute: async (conn, m, from, args) => {
        const link = args[0];
        if (!link || !link.includes("tiktok.com")) return conn.sendMessage(from, { text: "｢ ❓ ｣ Inserisci un link TikTok valido." });

        await conn.sendMessage(from, { text: "｢ ⏳ ｣ Scaricando il video..." });

        try {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${link}`);
            const videoUrl = res.data.video.noWatermark;

            await conn.sendMessage(from, { 
                video: { url: videoUrl }, 
                caption: "｢ 🎬 ｣ Video scaricato con successo da **ꪶ ⌬ ꫂ | ʙᴏᴛ**" 
            });
        } catch {
            conn.sendMessage(from, { text: "｢ ❌ ｣ Errore nel download del video." });
        }
    }
};

