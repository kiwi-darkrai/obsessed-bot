import axios from "axios";

export default {
    execute: async (conn, m, from, args) => {
        const text = args.join(" ");
        
        // Controllo se l'utente ha scritto qualcosa
        if (!text) {
            return conn.sendMessage(from, { 
                text: "｢ ❓ ｣ Ehi, sono l'intelligenza artificiale di **ꪶ ⌬ ꫂ**. Chiedimi pure quello che vuoi!\n\nEsempio: `.ai come posso migliorare il mio codice Node.js?`" 
            });
        }

        // Reazione per far capire che il bot sta "pensando"
        await conn.sendMessage(from, { react: { text: "🧠", key: m.key } });

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

            await conn.sendMessage(from, { text: aiStyle }, { quoted: m });

        } catch (e) {
            console.error(e);
            await conn.sendMessage(from, { 
                text: "｢ ❌ ｣ Oops! Il mio cervello digitale ha avuto un corto circuito. Riprova tra un istante." 
            });
        }
    }
};

