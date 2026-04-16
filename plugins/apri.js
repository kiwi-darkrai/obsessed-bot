module.exports = {
    adminOnly: true,
    execute: async (sock, mek, from) => {
        await sock.groupSettingUpdate(from, 'not_announcement');
        sock.sendMessage(from, { text: `｢ 🔓 ｣ **ɢʀᴏᴜᴘ_ᴏᴘᴇɴᴇᴅ**\nTutti possono scrivere.` });
    }
};

