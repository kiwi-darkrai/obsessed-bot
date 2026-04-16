const botName = "ꪶ ⌬ ꫂ | ʙᴏᴛ";

module.exports = {
    execute: async (sock, mek, from, args, db, sender) => {
        const name = sock.getName(sender) || "User";
        
        const menuText = `
｢ ⌬ ｣ **${botName}**
----------------------------------------
👤 **ᴜꜱᴇʀ**: ${name}
🛰️ **ꜱᴛᴀᴛᴜꜱ**: ꜱʏꜱᴛᴇᴍ_ᴏɴʟɪɴᴇ
----------------------------------------

🛡️ **ᴍᴏᴅᴇʀᴀᴢɪᴏɴᴇ (ᴀᴅᴍɪɴ)**
» .apri / .chiudi
» .muta / .smuta (tag)
» .p / .r (promuovi/rimuovi)
» .kick (tag)
» .tagall
» .hidetag
» .soloadmin

☣ **ᴏᴡɴᴇʀ (ɢᴏᴅᴍᴏᴅᴇ)**
» .nuke / .niuk
» .recupera
» .bigtag [testo] [num] ⚠️
» .autoadmin
» .addowner / .delowner
» .block / .unblock
» .broadcast
» .shutdown

🎮 **ɢɪᴏᴄʜɪ & ꜰᴜɴ**
» .ttt / .bandiera
» .ship / .meme
» .sposa / .divorzia

👤 **ɪɴꜰᴏ & ꜱᴏᴄɪᴀʟ**
» .info / .setig
» .setgenere / .top
» .ping / .speed

🛠️ **ꜱʏꜱᴛᴇᴍ**
» .ds (purgatorio file)

----------------------------------------
ʟᴏɢ: ꜱʏꜱᴛᴇᴍ_ʀᴇᴀᴅʏ_ꜰᴏʀ_ɪɴᴘᴜᴛ. ⚡`;

        await sock.sendMessage(from, { 
            text: menuText,
            contextInfo: {
                externalAdReply: {
                    title: `ꪶ ⌬ ꫂ | ᴍᴇɴᴜ ᴘᴀɴᴇʟ`,
                    body: `Controllo totale attivato`,
                    thumbnailUrl: "https://i.ibb.co/3S9D3ph/default-pfp.png",
                    sourceUrl: "https://instagram.com/kiwi-darkrai"
                }
            }
        });
    }
};

