export default {
    execute: async (conn, m, from, args, db, sender) => {
        const target = m.message.extendedTextMessage?.contextInfo?.mentionedJid[0];
        if (!target) return conn.sendMessage(from, { text: "｢ 💍 ｣ Tagga la persona che vuoi sposare!" });
        const text = `｢ 🤍 ｣ **ᴍᴀʀʀɪᴀɢᴇ ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛ**\n\n@${sender.split('@')[0]} ha chiesto la mano di @${target.split('@')[0]}!\n\n_Possa questa unione durare per sempre (o fino al prossimo .divorzia)_`;
        conn.sendMessage(from, { text, mentions: [sender, target] });
    }
};

