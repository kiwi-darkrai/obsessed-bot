module.exports = {
    ownerOnly: true,
    execute: async (sock, mek, from) => {
        await sock.sendMessage(from, { text: "｢ 🔴 ｣ **ꜱʏꜱᴛᴇᴍ_ᴏꜰꜰʟɪɴᴇ**\nSpegnimento in corso..." });
        process.exit();
    }
};

