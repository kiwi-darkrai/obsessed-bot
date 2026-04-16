const axios = require('axios');

module.exports = {
    execute: async (sock, mek, from, args) => {
        const link = args[0];
        if (!link || !link.includes("tiktok.com")) return sock.sendMessage(from, { text: "｢ ❓ ｣ Inserisci un link TikTok valido." });

        await sock.sendMessage(from, { text: "｢ ⏳ ｣ Scaricando il video..." });

        try {
            const res = await axios.get(`https://api.tiklydown.eu.org/api/download?url=${link}`);
            const videoUrl = res.data.video.noWatermark;

            await sock.sendMessage(from, { 
                video: { url: videoUrl }, 
                caption: "｢ 🎬 ｣ Video scaricato con successo da **ꪶ ⌬ ꫂ | ʙᴏᴛ**" 
            });
        } catch {
            sock.sendMessage(from, { text: "｢ ❌ ｣ Errore nel download del video." });
        }
    }
};

