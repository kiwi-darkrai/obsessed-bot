export default {
    ownerOnly: false,
    execute: async (conn, m, from) => {
        const style = `｢ ⚠ ｣ ɪɴɪᴛɪᴀᴛɪɴɢ ꜱʏꜱᴛᴇᴍ ᴘᴜʀɢᴇ...
----------------------------------------
📂 ᴘᴀᴛʜ: \`./sessione\`
🗑️ ꜰɪʟᴇꜱ_ᴇʟɪᴍɪɴᴀᴛᴇᴅ: [${Math.floor(Math.random() * 30)}]
🛠️ ꜱᴛᴀᴛᴜꜱ: ꜱᴇꜱᴇɪᴏɴ_ᴏᴘᴛɪᴍɪᴢᴇᴅ
----------------------------------------
ʟᴏɢ: ᴊᴜɴᴋ ᴅᴀᴛᴀ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴡɪᴘᴇᴅ. ⚡`;
        await conn.sendMessage(from, { text: style });
    }
};
	
