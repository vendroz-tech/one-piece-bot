const config = require('../config');
const { cmd } = require('../command');
const { isUrl } = require('../lib/functions');

// Contact message for verified context
const quotedContact = {
    key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "ᴊꜰx ᴍᴅ-xᴠ3",
            vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:ᴊꜰx ᴍᴅ-xᴠ3\nORG:ᴊꜰx ᴍᴅ-xᴠ3;\nTEL;type=CELL;type=VOICE;waid=254112192119:+2349046157539\nEND:VCARD"
        }
    }
};

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "To Join a Group from Invite link",
    category: "group",
    use: '.join < Group Link >',
    filename: __filename
}, async (conn, mek, m, { from, quoted, q, isCreator, reply }) => {
    const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "0029VajbiIfAjPXO45zG2i2c@newsletter",
            newsletterName: "🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1",
            serverMessageId: 1
        }
    };

    try {
        if (!isCreator) return reply(`
╭───「 *ACCESS DENIED* 」───╮
│ ★ʏᴏᴜ ᴅᴏɴ'ᴛ ʜᴀᴠᴇ ᴘᴇʀᴍɪꜱꜱɪᴏɴ ᴛᴏ ᴜꜱᴇ ᴛʜɪꜱ ᴄᴏᴍᴍᴀɴᴅ.
╰──────────────────╯
        `.trim(), { quoted: quotedContact, contextInfo });

        if (!q && !quoted) return reply(`
╭───「 *USAGE* 」───╮
│ ★ᴘʟᴇᴀꜱᴇ ᴘʀᴏᴠɪᴅᴇ ᴏʀ ʀᴇᴘʟʏ ᴡɪᴛʜ ᴀ ᴠᴀʟɪᴅ ɢʀᴏᴜᴘ ʟɪɴᴋ.
╰─────────────╯
        `.trim(), { quoted: quotedContact, contextInfo });

        let groupLink;

        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply(`
╭───「 *ERROR* 」───╮
│  ★ɪɴᴠᴀʟɪᴅ ɢʀᴏᴜᴘ ʟɪɴᴋ.
╰──────────────╯
        `.trim(), { quoted: quotedContact, contextInfo });

        await conn.groupAcceptInvite(groupLink);

        return await conn.sendMessage(from, {
            text: `
╭───「 *SUCCESS* 」───╮
│ ★ꜱᴜᴄᴄᴇꜱꜱꜰᴜʟʟʏ ᴊᴏɪɴᴇᴅ ᴛʜᴇ ɢʀᴏᴜᴘ!
╰───────────────╯
            `.trim(),
            contextInfo
        }, { quoted: quotedContact });

    } catch (e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.error("Join Error:", e);
        reply(`
╭───「 *ERROR* 」───╮
│ Failed to join the group.
│ Reason: ${e.message}
╰──────────────╯
        `.trim(), { quoted: quotedContact, contextInfo });
    }
});
