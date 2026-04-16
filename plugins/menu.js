export default {
    execute: async (conn, m, from, args, db, sender) => {
        const time = new Date().toLocaleTimeString();
        const totalCmds = db.totalCommands || 0;

        const menuText = `
｢ ⌬ ｣ **ꪶ  ᴍᴇɴᴜ ᴘʀɪɴᴄɪᴘᴀʟᴇ  ꫂ**
--------------------------------------------
👤 **ᴜᴛᴇɴᴛᴇ**: @${sender.split('@')[0]}
📊 **ᴄᴏᴍᴀɴᴅɪ ᴇsᴇɢᴜɪᴛɪ**: ${totalCmds}
⏰ **ᴏʀᴀ**: ${time}
--------------------------------------------

👑 **ᴘʀɪᴠɪʟᴇɢɪ ᴏᴡɴᴇʀ**
» .addowner | .delowner
» .broadcast | .shutdown
» .block | .unblock
» .nuke | .niuk | .bigtag
» .autoadmin | .ds (pulizia)

🛡️ **ᴀᴍᴍɪɴɪsᴛʀᴀᴢɪᴏɴᴇ (ᴀᴅᴍɪɴ)**
» .apri | .chiudi | .kick
» .hidetag | .tagall
» .muta | .smuta | .antilink
» .p (promuovi) | .r (demote)
» .setwelcome | .setbye

📥 **ᴅᴏᴡɴʟᴏᴀᴅ & ᴍᴇᴅɪᴀ**
» .play | .ig | .tiktok | .s

🎮 **ɢɪᴏᴄʜɪ & ꜰᴜɴ**
» .ttt | .ship | .sposa
» .divorzia | .bandiera | .meme

🌍 **ᴜᴛɪʟɪᴛʏ & ɪɴꜰᴏ**
» .weather | .news | .info
» .ping | .setig | .setgenere

🤖 **ɪɴᴛᴇʟʟɪɢᴇɴᴢᴀ ᴀʀᴛɪꜰɪᴄɪᴀʟᴇ**
» .ai [testo]

--------------------------------------------
_Powered by ꪶ ⌬ ꫂ | ᴅᴇᴠ: ᴍʀ. ᴋɪᴡɪ 🥝_
`;

        await conn.sendMessage(from, { 
            text: menuText, 
            mentions: [sender] 
        }, { quoted: m });
    }
};

