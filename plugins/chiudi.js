module.exports = {
    adminOnly: true,
    execute: async (sock, mek, from) => {
        await sock.groupSettingUpdate(from, 'announcement');
        sock.sendMessage(from, { text: `｢ 🔒 ｣ **ɢʀᴏᴜᴘ_ᴄʟᴏꜱᴇᴅ**\nSolo gli admin possono scrivere.` });
    }
};

