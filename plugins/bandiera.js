module.exports = {
    execute: async (sock, mek, from) => {
        const colors = ["🟥", "🟦", "🟩", "🟨", "🟧"];
        const chosen = colors[Math.floor(Math.random() * colors.length)];
        
        await sock.sendMessage(from, { text: "｢ 🚩 ｣ **ɢɪᴏᴄᴏ ᴅᴇʟʟᴀ ʙᴀɴᴅɪᴇʀᴀ**\n\nIl primo che invia l'emoji " + chosen + " vince!" });
        // La logica di controllo risposta andrebbe nell'index o in un gestore eventi, 
        // ma questo avvia il round.
    }
};

