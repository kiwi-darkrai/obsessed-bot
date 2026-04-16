export default {
    execute: async (conn, m, from) => {
        const timestamp = Date.now();
        const latency = Date.now() - timestamp; 
        const style = `｢ ⚡ ｣ **ꜱʏꜱᴛᴇᴍ_ꜱᴛᴀᴛᴜꜱ**
----------------------------------------
🚀 ʟᴀᴛᴇɴᴄʏ: ${latency}ms
🛰️ ꜱᴇʀᴠᴇʀ: ᴛᴇʀᴍᴜx_ʟɪɴᴜx
📡 ꜱᴛᴀᴛᴜꜱ: ᴏɴʟɪɴᴇ
----------------------------------------`;
        await conn.sendMessage(from, { text: style });
    }
};

