const axios = require('axios');

module.exports = {
    execute: async (sock, mek, from, args) => {
        const city = args.join(" ");
        if (!city) return sock.sendMessage(from, { text: "｢ ❓ ｣ Inserisci il nome di una città." });

        try {
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=06c96a8c1184700075196e8380482084&lang=it`);
            const { main, weather, wind, name } = res.data;

            const text = `
｢ 🌤️ ｣ **ᴍᴇᴛᴇᴏ: ${name.toUpperCase()}**
---------------------------
🌡️ **ᴛᴇᴍᴘ**: ${main.temp}°C
☁️ **ᴄᴏɴᴅɪᴢɪᴏɴɪ**: ${weather[0].description}
💧 **ᴜᴍɪᴅɪᴛᴀ**: ${main.humidity}%
💨 **ᴠᴇɴᴛᴏ**: ${wind.speed} m/s
---------------------------`;

            sock.sendMessage(from, { text });
        } catch {
            sock.sendMessage(from, { text: "｢ ❌ ｣ Città non trovata." });
        }
    }
};

