export default {
    adminOnly: true,
    execute: async (conn, m, from) => {
        await conn.groupSettingUpdate(from, 'not_announcement');
        conn.sendMessage(from, { text: `｢ 🔓 ｣ **ɢʀᴏᴜᴘ_ᴏᴘᴇɴᴇᴅ**\nTutti possono scrivere.` });
    }
};

