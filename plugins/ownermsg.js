//❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀  
//╔═════ஜ۩۞۩ஜ═════╗
//༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-ℝ𝔼𝔹𝕆ℝℕ༒
//╚═════ஜ۩۞۩ஜ═════╝

const { cmd } = require('../command');

cmd({
    pattern: "block",
    desc: "Blocks this chat",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    // Get the bot owner's number dynamically
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    
    if (m.sender !== botOwner) {
        await react("❌");
        return reply("_Only the bot owner can use this command._");
    }

    try {
        const chatId = m.chat; // Get current chat ID
        await react("✅");
        
        // Combine both messages into one send operation
        await conn.sendMessage(m.chat, { 
            text: `_Successfully blocked this chat_`,
            image: { url: `https://files.catbox.moe/pvhmgv.jpg` },  
            caption: "*ᴊꜰx ᴍᴅ-xᴠ3 𝐍𝐄𝐖𝐒𝐋𝐄𝐓𝐓𝐄𝐑*\n\nThis chat has been blocked by the owner.",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420646690174@newsletter',
                    newsletterName: 'ᴊꜰx ᴍᴅ-xᴠ3',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });
        
        // Actually block the chat after sending the message
        await conn.updateBlockStatus(chatId, "block");
    } catch (error) {
        console.error("Block command error:", error);
        await react("❌");
        reply(`_Failed to block this chat._\nError: ${error.message}_`);
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblocks this chat",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("❌");
        return reply("_Only the bot owner can use this command._");
    }

    try {
        const chatId = m.chat; // Get current chat ID
        await react("✅");
        
        // Combine both messages into one send operation
        await conn.sendMessage(m.chat, { 
            text: `_Successfully unblocked this chat_`,
            image: { url: `https://files.catbox.moe/pvhmgv.jpg` },  
            caption: "*ᴊꜰx ᴍᴅ-xᴠ3 𝐍𝐄𝐖𝐒𝐋𝐄𝐓𝐓𝐄𝐑*\n\nThis chat has been unblocked by the owner.",
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420646690174@newsletter',
                    newsletterName: 'ᴊꜰx ᴍᴅ-xᴠ3',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });
        
        // Actually unblock the chat after sending the message
        await conn.updateBlockStatus(chatId, "unblock");
    } catch (error) {
        console.error("Unblock command error:", error);
        await react("❌");
        reply(`_Failed to unblock this chat._\nError: ${error.message}_`);
    }
});
