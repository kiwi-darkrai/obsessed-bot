const { getDevice } = require("@whiskeysockets/baileys");

module.exports = {
    execute: async (sock, mek, from, args, db, sender) => {
        const target = mek.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (mek.message.extendedTextMessage?.contextInfo?.quotedMessage ? mek.message.extendedTextMessage.contextInfo.participant : sender);
        
        const device = getDevice(mek.key.id) || "Unknown";
        const userData = db.users[target] || { msgCount: 0, genere: "Non impostato", instagram: "Non collegato" };
        const name = sock.getName(target) || "Utente";
        
        // Gestione Link Instagram
        const igDisplay = userData.instagram && userData.instagram !== "Non collegato" 
            ? `https://instagram.com/${userData.instagram}` 
            : "Non collegato";

        let pfp;
        try { pfp = await sock.profilePictureUrl(target, 'image'); } 
        catch { pfp = 'https://i.ibb.co/3S9D3ph/default-pfp.png'; }

        const style = `
｢ 👤 ｣ **ᴜꜱᴇʀ_ᴘʀᴏꜰɪʟᴇ**
----------------------------------------
📂 ɴᴀᴍᴇ: ${name}
🆔 ɪᴅ: @${target.split('@')[0]}
🚻 ɢᴇɴᴇʀᴇ: ${userData.genere || "Non impostato"}
📱 ᴅᴇᴠɪᴄᴇ: ${device.toUpperCase()}
📊 ᴍᴇꜱꜱᴀɢɢɪ: ${userData.msgCount || 0}
📸 ɪɴꜱᴛᴀɢʀᴀᴍ: ${igDisplay}
----------------------------------------
ʟᴏɢ: ꜱʏꜱᴛᴇᴍ_ᴅᴀᴛᴀ_ᴏᴘᴛɪᴍɪᴢᴇᴅ. ⚡`;

        await sock.sendMessage(from, { 
            image: { url: pfp }, 
            caption: style, 
            mentions: [target] 
        });
    }
};

