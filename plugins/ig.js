const axios = require('axios');

module.exports = {
    execute: async (sock, mek, from, args) => {
        const url = args[0];
        if (!url || !url.includes("instagram.com")) {
            return sock.sendMessage(from, { text: "｢ ❓ ｣ Inserisci un link Instagram valido." });
        }

        await sock.sendMessage(from, { text: "｢ ⏳ ｣ Recupero media da Instagram..." });

        try {
            const res = await axios.get(`https://api.botcahlx.live/api/dowloader/ig?url=${url}&apikey=P9qS6v6f`);
            const media = res.data.result[0].url;

            if (media.includes('.mp4')) {
                await sock.sendMessage(from, { video: { url: media }, caption: "｢ 📸 ｣ Reel scaricato con successo." });
            } else {
                await sock.sendMessage(from, { image: { url: media }, caption: "｢ 📸 ｣ Foto scaricata con successo." });
            }
        } catch {
            sock.sendMessage(from, { text: "｢ ❌ ｣ Errore nel download. Il profilo potrebbe essere privato." });
        }
    }
};

