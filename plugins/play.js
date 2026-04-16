const yts = require('yt-search');
const { exec } = require('child_process');

export default {
    execute: async (conn, m, from, args) => {
        const query = args.join(" ");
        if (!query) return conn.sendMessage(from, { text: "｢ ❓ ｣ Cosa vuoi ascoltare?\nEsempio: `.play blun7 a swishland`" });

        await conn.sendMessage(from, { text: `｢ ⏳ ｣ Ricerca di "${query}" in corso...` });

        const search = await yts(query);
        const video = search.videos[0];

        if (!video) return conn.sendMessage(from, { text: "｢ ❌ ｣ Nessun risultato trovato." });

        const infoText = `
｢ 🎵 ｣ **ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ...**
---------------------------
📌 **ᴛɪᴛᴏʟᴏ**: ${video.title}
⏱️ **ᴅᴜʀᴀᴛᴀ**: ${video.timestamp}
🔗 **ᴜʀʟ**: ${video.url}
---------------------------`;

        await conn.sendMessage(from, { image: { url: video.thumbnail }, caption: infoText });

        // Qui useremo una API esterna per il download per non appesantire Termux
        const audioUrl = `https://api.dhamprojects.rocks/api/ytdl?url=${video.url}&type=audio`;
        
        await conn.sendMessage(from, { 
            audio: { url: audioUrl }, 
            mimetype: 'audio/mp4', 
            fileName: `${video.title}.mp3` 
        }, { quoted: m });
    }
};

