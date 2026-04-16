module.exports = {
    execute: async (sock, mek, from) => {
        const grid = "𝟙 | 𝟚 | 𝟛\n--+---+--\n𝟜 | 𝟝 | 𝟞\n--+---+--\n𝟟 | 𝟠 | 𝟡";
        const text = `｢ 🎮 ｣ **ᴛɪᴄ ᴛᴀᴄ ᴛᴏᴇ**\n\n${grid}\n\nRispondi con un numero per iniziare!`;
        sock.sendMessage(from, { text });
    }
};

