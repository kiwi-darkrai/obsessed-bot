const axios = require('axios');

module.exports = {
    execute: async (sock, mek, from, args) => {
        const text = args.join(" ");
        
        // Controllo se l'utente ha scritto qualcosa
        if (!text) {
            return sock.sendMessage(from, { 
                text: "｢ ❓ ｣ Ehi, sono l'intelligenza artificiale di **ꪶ ⌬ ꫂ**. Chiedimi pure quello che vuoi!\n\nEsempio: `.ai come posso migliorare il mio codice Node.js?`" 
            });
        }

        // Reazione per far capire che il bot sta "pensando"
        await sock.sendMessage(from, { react: { text: "🧠", key: mek.key } });

        try {
            // Utilizzo di un endpoint pubblico per GPT-4/3.5
            // Nota: Se questa API dovesse andare offline, si può cambiare facilmente l'URL
            const response = await axios.get(`https://api.api-zero.biz.id/api/ai/chatgpt?q=${encodeURIComponent(text)}`);
            
            const result = response.data.result || response.data.response;

            if (!result) throw new Error("Risposta vuota");

            const aiStyle = `
｢ 🤖 ｣ **ᴀɪ_ᴀꜱꜱɪꜱᴛᴀɴᴛ**
----------------------------------------
${result}
----------------------------------------
ʟᴏɢ: ʀᴇꜱᴘᴏɴꜱᴇ_ɢᴇɴᴇʀᴀᴛᴇᴅ. ✨`;

            await sock.sendMessage(from, { text: aiStyle }, { quoted: mek });

        } catch (e) {
            console.error(e);
            await sock.sendMessage(from, { 
                text: "｢ ❌ ｣ Oops! Il mio cervello digitale ha avuto un corto circuito. Riprova tra un istante." 
            });
        }
    }
};

