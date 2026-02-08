const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "delete",
    react: "❌",
    alias: ["del", "remove"],
    desc: "Delete a quoted message",
    category: "utility",
    usage: '.del (reply to a message)',
    filename: __filename
},
async (conn, m, { isOwner, isAdmin, reply, quoted, chat }) => {
    try {
        // Check if there's a quoted message
        if (!quoted) return reply("ᴘʟᴇᴀꜱᴇ ʀᴇᴘʟʏ ᴛᴏ ᴛʜᴇ ᴍᴇꜱꜱᴀɢᴇ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ᴅᴇʟᴇᴛᴇ.");
        
        // For group chats, check if user has permission (owner or admin)
        if (m.isGroup && !isOwner && !isAdmin) {
            return reply("ʏᴏᴜ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ɪɴ ɢʀᴏᴜᴘs.");
        }
        
        // Delete the message
        await conn.sendMessage(chat, {
            delete: {
                remoteJid: chat,
                fromMe: quoted.fromMe,
                id: quoted.id,
                participant: quoted.sender
            }
        });
        
    } catch (e) {
        console.error('Error in delete command:', e);
        reply("❌ Failed to delete the message. Please try again.");
    }
});
