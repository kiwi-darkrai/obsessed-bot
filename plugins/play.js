import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yts = require('yt-search');

export default {
    execute: async (conn, m, from, args) => {
        if (!args[0]) return conn.sendMessage(from, { text: 'Dimmi cosa cercare, bro.' });
        try {
            const search = await yts(args.join(' '));
            const video = search.videos[0];
            if (!video) return conn.sendMessage(from, { text: 'Nulla trovato.' });
            let txt = `ꪶ ⌬ ꫂ | ᴘʟᴀʏ\n\n🎬 ${video.title}\n🔗 ${video.url}`;
            await conn.sendMessage(from, { text: txt }, { quoted: m });
        } catch (e) { console.log(e); }
    }
}
