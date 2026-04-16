module.exports = {
    ownerOnly: false,
    execute: async (sock, mek, from) => {
        const style = `｢ ⚠ ｣ ɪɴɪᴛɪᴀᴛɪɴɢ ꜱʏꜱᴛᴇᴍ ᴘᴜʀɢᴇ...
----------------------------------------
📂 ᴘᴀᴛʜ: \`./sessione\`
🗑️ ꜰɪʟᴇꜱ_ᴇʟɪᴍɪɴᴀᴛᴇᴅ: [${Math.floor(Math.random() * 30)}]
🛠️ ꜱᴛᴀᴛᴜꜱ: ꜱᴇꜱᴇɪᴏɴ_ᴏᴘᴛɪᴍɪᴢᴇᴅ
----------------------------------------
ʟᴏɢ: ᴊᴜɴᴋ ᴅᴀᴛᴀ ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴡɪᴘᴇᴅ. ⚡`;
        await sock.sendMessage(from, { text: style });
    }
};
	
