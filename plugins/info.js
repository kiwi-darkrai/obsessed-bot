const { getDevice } = require("@whiskeysockets/baileys");

export default {
    execute: async (conn, m, from, args, db, sender) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0] || 
                       (m.message.extendedTextMessage?.contextInfo?.quotedMessage ? m.message.extendedTextMessage.contextInfo.participant : sender);
        
        const device = getDevice(m.key.id) || "Unknown";
        const userData = db.users[target] || { msgCount: 0, genere: "Non impostato", instagram: "Non collegato" };
        const name = conn.getName(target) || "Utente";
        
        // Gestione Link Instagram
        const igDisplay = userData.instagram && userData.instagram !== "Non collegato" 
            ? `https://instagram.com/${userData.instagram}` 
            : "Non collegato";

        let pfp;
        try { pfp = await conn.profilePictureUrl(target, 'image'); } 
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

        await conn.sendMessage(from, { 
            image: { url: pfp }, 
            caption: style, 
            mentions: [target] 
        });
    }
};

