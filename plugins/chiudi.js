export default {
    adminOnly: true,
    execute: async (conn, m, from) => {
        await conn.groupSettingUpdate(from, 'announcement');
        conn.sendMessage(from, { text: `｢ 🔒 ｣ **ɢʀᴏᴜᴘ_ᴄʟᴏꜱᴇᴅ**\nSolo gli admin possono scrivere.` });
    }
};

