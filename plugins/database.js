
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

// Helper function to send responses with newsletter info
async function sendResponse(conn, from, replyText, quotedMsg) {
    await conn.sendMessage(from, { 
        image: { url: `https://files.catbox.moe/u9noai.jpg` },  
        caption: replyText,
        contextInfo: {
            mentionedJid: [quotedMsg.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '0029VajbiIfAjPXO45zG2i2c@newsletter',
                newsletterName: '🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1',
                serverMessageId: 143
            }
        }
    }, { quoted: quotedMsg });
}

cmd({
    pattern: "adminevents",
    alias: ["adminevents"],
    desc: "Enable or disable admin event notifications",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ADMIN_EVENTS = "true";
        return await sendResponse(conn, from, "✅ Admin event notifications are now enabled.", m);
    } else if (status === "off") {
        config.ADMIN_EVENTS = "false";
        return await sendResponse(conn, from, "❌ Admin event notifications are now disabled.", m);
    } else {
        return await sendResponse(conn, from, `Example: .admin-events on`, m);
    }
});

cmd({
    pattern: "welcome",
    alias: ["welcomeset"],
    desc: "Enable or disable welcome messages for new members",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "* ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.WELCOME = "true";
        return await sendResponse(conn, from, " ᴡᴇʟᴄᴏᴍᴇ ᴍᴇꜱꜱᴀɢᴇꜱ ᴀʀᴇ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.", m);
    } else if (status === "off") {
        config.WELCOME = "false";
        return await sendResponse(conn, from, "ᴡᴇʟᴄᴏᴍᴇ ᴍᴇꜱꜱᴀɢᴇꜱ ᴀʀᴇ ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.", m);
    } else {
        return await sendResponse(conn, from, `Example: .welcome on`, m);
    }
});

cmd({
    pattern: "setprefix",
    alias: ["prefix"],
    react: "🔧",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (message, match, { from, args, isCreator, reply }) => {
    if (!isCreator) return await message.sendMessage("* ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!*");

    const newPrefix = args[0];
    if (!newPrefix) return await message.sendMessage("ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴇᴡ ᴘʀᴇꜰɪx. ᴇxᴀᴍᴘʟᴇ: `.ꜱᴇᴛᴘʀᴇꜰɪx !");

    // Update config in memory
    config.PREFIX = newPrefix;
    
    // Update config file permanently
    try {
        const configPath = path.join(__dirname, '../config.js');
        let configFile = fs.readFileSync(configPath, 'utf8');
        configFile = configFile.replace(
            /PREFIX:.*?(,|})/,
            `PREFIX: "${newPrefix}"$1`
        );
        fs.writeFileSync(configPath, configFile);
        return await message.sendMessage(`✅ Prefix successfully changed to *${newPrefix}*`);
    } catch (error) {
        console.error('Error updating prefix:', error);
        return await message.sendMessage("❌ Failed to update prefix in config file.");
    }
});

cmd({
    pattern: "mode",
    alias: ["setmode"],
    react: "🫟",
    desc: "Set bot mode to private or public.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "* ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (!args[0]) {
        return await sendResponse(conn, from, `📌 Current mode: *${config.MODE}*\n\nUsage: .mode private OR .mode public`, m);
    }

    const modeArg = args[0].toLowerCase();
    if (modeArg === "private") {
        config.MODE = "private";
        return await sendResponse(conn, from, "ʙᴏᴛ ᴍᴏᴅᴇ ɪꜱ ɴᴏᴡ ꜱᴇᴛ ᴛᴏ *ᴘʀɪᴠᴀᴛᴇ*.", m);
    } else if (modeArg === "public") {
        config.MODE = "public";
        return await sendResponse(conn, from, "ʙᴏᴛ ᴍᴏᴅᴇ ɪꜱ ɴᴏᴡ ꜱᴇᴛ ᴛᴏ *ᴘᴜʙʟɪᴄ*.", m);
    } else {
        return await sendResponse(conn, from, "❌ Invalid mode. Please use `.mode private` or `.mode public`.", m);
    }
});

cmd({
    pattern: "autotyping",
    description: "Enable or disable auto-typing feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "* ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return await sendResponse(conn, from, "*🫟 ᴇxᴀᴍᴘʟᴇ:  .ᴀᴜᴛᴏ-ᴛʏᴘɪɴɢ ᴏɴ*", m);
    }

    config.AUTO_TYPING = status === "on" ? "true" : "false";
    return await sendResponse(conn, from, `ᴀᴜᴛᴏ ᴛʏᴘɪɴɢ ʜᴀꜱ ʙᴇᴇɴ ᴛᴜʀɴᴇᴅ ${status}.`, m);
});

cmd({
    pattern: "mentionreply",
    alias: ["menetionreply", "mee"],
    description: "Set bot status to always online or offline.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.MENTION_REPLY = "true";
        return await sendResponse(conn, from, "Mention Reply feature is now enabled.", m);
    } else if (args[0] === "off") {
        config.MENTION_REPLY = "false";
        return await sendResponse(conn, from, "Mention Reply feature is now disabled.", m);
    } else {
        return await sendResponse(conn, from, `_example:  .mee on_`, m);
    }
});

cmd({
    pattern: "alwaysonline",
    alias: ["alwaysonline"],
    desc: "Enable or disable the always online mode",
    category: "settings",
    filename: __filename
},
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*📛 ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    const status = args[0]?.toLowerCase();
    if (status === "on") {
        config.ALWAYS_ONLINE = "true";
        await sendResponse(conn, from, "*ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ ᴍᴏᴅᴇ ɪꜱ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (status === "off") {
        config.ALWAYS_ONLINE = "false";
        await sendResponse(conn, from, "*ᴀʟᴡᴀʏꜱ ᴏɴʟɪɴᴇ ᴍᴏᴅᴇ ɪꜱ ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        await sendResponse(conn, from, `*🛠️ ᴇxᴀᴍᴘʟᴇ: .ᴀʟᴡᴀʏs-ᴏɴʟɪɴᴇ ᴏɴ*`, m);
    }
});

cmd({
    pattern: "autorecording",
    alias: ["autorecoding"],
    description: "Enable or disable auto-recording feature.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    const status = args[0]?.toLowerCase();
    if (!["on", "off"].includes(status)) {
        return await sendResponse(conn, from, "*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ʀᴇᴄᴏʀᴅɪɴɢ ᴏɴ*", m);
    }

    config.AUTO_RECORDING = status === "on" ? "true" : "false";
    if (status === "on") {
        await conn.sendPresenceUpdate("recording", from);
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ ɪꜱ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.* ʙᴏᴛ ɪꜱ ʀᴇᴄᴏʀᴅɪɴɢ...", m);
    } else {
        await conn.sendPresenceUpdate("available", from);
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ ʀᴇᴄᴏʀᴅɪɴɢ ʜᴀꜱ ʙᴇᴇɴ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    }
});

cmd({
    pattern: "autoseen",
    alias: ["autostatusview"],
    desc: "Enable or disable auto-viewing of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_STATUS_SEEN = "true";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ᴠɪᴇᴡɪɴɢ ᴏf sᴛᴀᴛᴜsᴇs ɪꜱ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_STATUS_SEEN = "false";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ᴠɪᴇᴡɪɴɢ ᴏf sᴛᴀᴛᴜsᴇs ʜᴀꜱ ʙᴇᴇɴ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `*🫟 ᴇxᴀᴍᴘʟᴇ:  .ᴀᴜᴛᴏ-sᴇᴇɴ ᴏɴ*`, m);
    }
}); 

cmd({
    pattern: "statusreact",
    alias: ["autostatusreact"],
    desc: "Enable or disable auto-liking of statuses",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_STATUS_REACT = "true";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʟɪᴋɪɴɢ ᴏf sᴛᴀᴛᴜsᴇs ɪꜱ ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REACT = "false";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʟɪᴋɪɴɢ ᴏf sᴛᴀᴛᴜsᴇs ʜᴀꜱ ʙᴇᴇɴ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `*🛠️ ᴇxᴀᴍᴘʟᴇ: .status-react on*`, m);
    }
});

cmd({
    pattern: "readmessage",
    alias: ["autoread"],
    desc: "enable or disable readmessage.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.READ_MESSAGE = "true";
        return await sendResponse(conn, from, "*ʀᴇᴀᴅᴍᴇssᴀɢᴇ ꜰᴇᴀᴛᴜʀᴇ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.READ_MESSAGE = "false";
        return await sendResponse(conn, from, "*ʀᴇᴀᴅᴍᴇssᴀɢᴇ ꜰᴇᴀᴛᴜʀᴇ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `_example:  .readmessage on_`, m);
    }
});

cmd({
    pattern: "autovoice",
    alias: ["autovoice"],
    desc: "enable or disable readmessage.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_VOICE = "true";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ᴠᴏɪᴄɪɴɢ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_VOICE = "false";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ᴠᴏɪᴄɪɴɢ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `_example:  .autovoice on_`, m);
    }
});

cmd({
    pattern: "antibad",
    alias: ["antibadword"],
    desc: "enable or disable antibad.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.ANTI_BAD_WORD = "true";
        return await sendResponse(conn, from, "*ᴀɴᴛɪ-ʙᴀᴅ-ᴡᴏʀᴅ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.ANTI_BAD_WORD = "false";
        return await sendResponse(conn, from, "*ᴀɴᴛɪ-ʙᴀᴅ-ᴡᴏʀᴅ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `_example:  .antibad on_`, m);
    }
});

cmd({
    pattern: "autosticker",
    alias: ["autosticker"],
    desc: "enable or disable auto-sticker.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_STICKER = "true";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ꜱᴛɪᴄᴋᴇʀ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_STICKER = "false";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ꜱᴛɪᴄᴋᴇʀ ꜰᴇᴀᴛᴜʀᴇ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `_example:  .auto-sticker on_`, m);
    }
});

cmd({
    pattern: "autoreply",
    alias: ["autoreply"],
    desc: "enable or disable auto-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_REPLY = "true";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʀᴇᴘʟʏ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_REPLY = "false";
        return await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʀᴇᴘʟʏ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `*🫟 ᴇxᴀᴍᴘʟᴇ: . ᴀᴜᴛᴏ-ʀᴇᴘʟʏ ᴏɴ*`, m);
    }
});

cmd({
    pattern: "autoreact",
    alias: ["autoreact"],
    desc: "Enable or disable the autoreact feature",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_REACT = "true";
        await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_REACT = "false";
        await sendResponse(conn, from, "*ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        await sendResponse(conn, from, `*🫟 ᴇxᴀᴍᴘʟᴇ: .ᴀᴜᴛᴏ-ʀᴇᴀᴄᴛ ᴏɴ*`, m);
    }
});

cmd({
    pattern: "statusreply",
    alias: ["autostatusreply"],
    desc: "enable or disable status-reply.",
    category: "settings",
    filename: __filename
},    
async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return await sendResponse(conn, from, "*ᴏɴʟʏ ᴛʜᴇ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ!*", m);

    if (args[0] === "on") {
        config.AUTO_STATUS_REPLY = "true";
        return await sendResponse(conn, from, "*sᴛᴀᴛᴜs-ʀᴇᴘʟʏ ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
        config.AUTO_STATUS_REPLY = "false";
        return await sendResponse(conn, from, "*sᴛᴀᴛᴜs-ʀᴇᴘʟʏ ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
        return await sendResponse(conn, from, `*ᴇxᴀᴍᴘʟᴇ:  .sᴛᴀᴛᴜs-ʀᴇᴘʟʏ ᴏɴ*`, m);
    }
});

cmd({
  pattern: "antilink",
  alias: ["antilinks"],
  desc: "Enable or disable ANTI_LINK in groups",
  category: "group",
  react: "🚫",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, from, reply }) => {
  try {
    if (!isGroup) return await sendResponse(conn, from, 'ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜꜱᴇᴅ ɪɴ ᴀ ɢʀᴏᴜᴘ.', m);
    if (!isBotAdmins) return await sendResponse(conn, from, 'ʙᴏᴛ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);
    if (!isAdmins) return await sendResponse(conn, from, 'ʏᴏᴜ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);

    if (args[0] === "on") {
      config.ANTI_LINK = "true";
      await sendResponse(conn, from, "*ANTI_LINK ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
      config.ANTI_LINK = "false";
      await sendResponse(conn, from, "*ANTI_LINK ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
      await sendResponse(conn, from, "Usage: *.antilink on/off*", m);
    }
  } catch (e) {
    await sendResponse(conn, from, `Error: ${e.message}`, m);
  }
});

cmd({
  pattern: "antilinkkick",
  alias: ["kicklink"],
  desc: "Enable or disable ANTI_LINK_KICK in groups",
  category: "group",
  react: "⚠️",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, from, reply }) => {
  try {
    if (!isGroup) return await sendResponse(conn, from, 'ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜꜱᴇᴅ ɪɴ ᴀ ɢʀᴏᴜᴘ.', m);
    if (!isBotAdmins) return await sendResponse(conn, from, 'ʙᴏᴛ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);
    if (!isAdmins) return await sendResponse(conn, from, 'ʏᴏᴜ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);

    if (args[0] === "on") {
      config.ANTI_LINK_KICK = "true";
      await sendResponse(conn, from, "* ANTI_LINK_KICK ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
      config.ANTI_LINK_KICK = "false";
      await sendResponse(conn, from, "*❌ ANTI_LINK_KICK ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
      await sendResponse(conn, from, "Usage: *.antilinkkick on/off*", m);
    }
  } catch (e) {
    await sendResponse(conn, from, `Error: ${e.message}`, m);
  }
});

cmd({
  pattern: "deletelink",
  alias: ["linksdelete"],
  desc: "Enable or disable DELETE_LINKS in groups",
  category: "group",
  react: "❌",
  filename: __filename
}, async (conn, mek, m, { isGroup, isAdmins, isBotAdmins, args, from, reply }) => {
  try {
    if (!isGroup) return await sendResponse(conn, from, 'ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ ᴄᴀɴ ᴏɴʟʏ ʙᴇ ᴜꜱᴇᴅ ɪɴ ᴀ ɢʀᴏᴜᴘ.', m);
    if (!isBotAdmins) return await sendResponse(conn, from, 'ʙᴏᴛ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);
    if (!isAdmins) return await sendResponse(conn, from, 'ʏᴏᴜ ᴍᴜꜱᴛ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.', m);

    if (args[0] === "on") {
      config.DELETE_LINKS = "true";
      await sendResponse(conn, from, "*DELETE_LINKS ɪs ɴᴏᴡ ᴇɴᴀʙʟᴇᴅ.*", m);
    } else if (args[0] === "off") {
      config.DELETE_LINKS = "false";
      await sendResponse(conn, from, "*DELETE_LINKS ɪs ɴᴏᴡ ᴅɪꜱᴀʙʟᴇᴅ.*", m);
    } else {
      await sendResponse(conn, from, "Usage: *.deletelink on/off*", m);
    }
  } catch (e) {
    await sendResponse(conn, from, `Error: ${e.message}`, m);
  }
});
