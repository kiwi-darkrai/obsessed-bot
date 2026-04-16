module.exports = {
    execute: async (sock, mek, from) => {
        const timestamp = Date.now();
        const latency = Date.now() - timestamp; 
        const style = `｢ ⚡ ｣ **ꜱʏꜱᴛᴇᴍ_ꜱᴛᴀᴛᴜꜱ**
----------------------------------------
🚀 ʟᴀᴛᴇɴᴄʏ: ${latency}ms
🛰️ ꜱᴇʀᴠᴇʀ: ᴛᴇʀᴍᴜx_ʟɪɴᴜx
📡 ꜱᴛᴀᴛᴜꜱ: ᴏɴʟɪɴᴇ
----------------------------------------`;
        await sock.sendMessage(from, { text: style });
    }
};

