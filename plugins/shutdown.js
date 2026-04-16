export default {
    ownerOnly: true,
    execute: async (conn, m, from) => {
        await conn.sendMessage(from, { text: "｢ 🔴 ｣ **ꜱʏꜱᴛᴇᴍ_ᴏꜰꜰʟɪɴᴇ**\nSpegnimento in corso..." });
        process.exit();
    }
};

