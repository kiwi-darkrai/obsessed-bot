const axios = require('axios');

export default {
    execute: async (conn, m, from, args) => {
        const city = args.join(" ");
        if (!city) return conn.sendMessage(from, { text: "｢ ❓ ｣ Inserisci il nome di una città.\nEsempio: `.weather Milano`" });

        try {
            // URL con API Key (Assicurati che sia attiva su openweathermap.org)
            const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=06c96a8c1184700075196e8380482084&lang=it`);
            
            const { main, weather, wind, name, sys } = res.data;
            
            // Mappa delle icone per renderlo più figo
            const icons = {
                "Clear": "☀️",
                "Clouds": "☁️",
                "Rain": "🌧️",
                "Thunderstorm": "⛈️",
                "Snow": "❄️",
                "Drizzle": "🌦️",
                "Mist": "🌫️"
            };
            const icon = icons[weather[0].main] || "🌤️";

            const text = `
｢ ${icon} ｣ **ᴍᴇᴛᴇᴏ: ${name.toUpperCase()} (${sys.country})**
---------------------------
🌡️ **ᴛᴇᴍᴘᴇʀᴀᴛᴜʀᴀ**: ${Math.round(main.temp)}°C
🌡️ **ᴘᴇʀᴄᴇᴘɪᴛᴀ**: ${Math.round(main.feels_like)}°C
☁️ **ᴄᴏɴᴅɪᴢɪᴏɴɪ**: ${weather[0].description}
💧 **ᴜᴍɪᴅɪᴛᴀ**: ${main.humidity}%
💨 **ᴠᴇɴᴛᴏ**: ${wind.speed} m/s
---------------------------
_Powered by ꪶ ⌬ ꫂ | ᴍʀ. ᴋɪᴡɪ_`;

            await conn.sendMessage(from, { text });
        } catch (error) {
            // Log dell'errore per te nel terminale, ma messaggio pulito per l'utente
            console.error("Errore Meteo:", error.response ? error.response.data : error.message);
            conn.sendMessage(from, { text: "｢ ❌ ｣ Impossibile recuperare il meteo. Controlla il nome della città o riprova più tardi." });
        }
    }
};

