const yts = require('yt-search');
const { exec } = require('child_process');

module.exports = {
    execute: async (sock, mek, from, args) => {
        const query = args.join(" ");
        if (!query) return sock.sendMessage(from, { text: "｢ ❓ ｣ Cosa vuoi ascoltare?\nEsempio: `.play blun7 a swishland`" });

        await sock.sendMessage(from, { text: `｢ ⏳ ｣ Ricerca di "${query}" in corso...` });

        const search = await yts(query);
        const video = search.videos[0];

        if (!video) return sock.sendMessage(from, { text: "｢ ❌ ｣ Nessun risultato trovato." });

        const infoText = `
｢ 🎵 ｣ **ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ...**
---------------------------
📌 **ᴛɪᴛᴏʟᴏ**: ${video.title}
⏱️ **ᴅᴜʀᴀᴛᴀ**: ${video.timestamp}
🔗 **ᴜʀʟ**: ${video.url}
---------------------------`;

        await sock.sendMessage(from, { image: { url: video.thumbnail }, caption: infoText });

        // Qui useremo una API esterna per il download per non appesantire Termux
        const audioUrl = `https://api.dhamprojects.rocks/api/ytdl?url=${video.url}&type=audio`;
        
        await sock.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', 
            fileName: `${video.title}.mp3` 
        }, { quoted: mek });
    }
};

