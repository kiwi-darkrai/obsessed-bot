const { exec } = require('child_process');
const fs = require('fs');
const { getRandom } = require('../lib/myfunc'); // Se non l'hai, usa: const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`

module.exports = {
    execute: async (sock, mek, from, args) => {
        const type = Object.keys(mek.message)[0];
        const isQuotedImage = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo.quotedMessage?.imageMessage;
        const isImage = type === 'imageMessage';
        const isQuotedVideo = type === 'extendedTextMessage' && mek.message.extendedTextMessage.contextInfo.quotedMessage?.videoMessage;
        const isVideo = type === 'videoMessage';

        if (!isImage && !isQuotedImage && !isVideo && !isQuotedVideo) {
            return sock.sendMessage(from, { text: "｢ ❓ ｣ Rispondi a una foto o video con `.s`" });
        }

        const msg = isQuotedImage || isQuotedVideo ? mek.message.extendedTextMessage.contextInfo.quotedMessage : mek.message;
        const stream = await sock.downloadMediaMessage({ message: msg }, 'buffer');
        
        const nameJpg = `./${Math.floor(Math.random() * 10000)}.jpg`;
        const nameWebp = `./${Math.floor(Math.random() * 10000)}.webp`;

        fs.writeFileSync(nameJpg, stream);

        await sock.sendMessage(from, { text: "｢ ⏳ ｣ Elaborazione sticker..." });

        // Comando FFmpeg ottimizzato per sticker quadrati e leggeri
        const cmd = `ffmpeg -i ${nameJpg} -vcodec libwebp -filter:v "scale='if(gt(a,1),512,-1)':'if(gt(a,1),-1,512)',pad=512:512:(512-iw)/2:(512-ih)/2:color=white@0" -loop 0 -preset default -an -vsync 0 -s 512:512 ${nameWebp}`;

        exec(cmd, async (err) => {
            if (err) {
                console.log(err);
                return sock.sendMessage(from, { text: "｢ ❌ ｣ Errore FFmpeg. Assicurati di aver fatto 'pkg install ffmpeg'" });
            }

            const sticker = fs.readFileSync(nameWebp);
            await sock.sendMessage(from, { sticker: sticker });

            // Pulizia
            if (fs.existsSync(nameJpg)) fs.unlinkSync(nameJpg);
            if (fs.existsSync(nameWebp)) fs.unlinkSync(nameWebp);
        });
    }
};

