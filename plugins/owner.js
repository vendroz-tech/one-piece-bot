const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: 'owner',
    react: '🦋',
    desc: 'Get owner number',
    category: 'main',
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER;
        const ownerName = config.OWNER_NAME;
        
        // Create vCard
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}
END:VCARD`;

        // Fake verified contact
        const verifiedContact = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "ᴊꜰx ᴍᴅ-xᴠ3",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:ᴊꜰx ᴍᴅ-xᴠ3;\nTEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\nEND:VCARD`
                }
            }
        };

        // Send contact
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: verifiedContact });

        // Send image with caption
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/u9noai.jpg' },
            caption: `╭━━〔 *🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1* 〕━━┈⊷
┃❍╭─────────────·๏
┃❍┃• *Here is the owner details*
┃❍┃• *ɴᴀᴍᴇ* - 🅰︎🅻︎🅿︎🅷︎🅰︎-🅺︎🅸︎🅽︎🅶︎
┃❍┃• *ɴᴜᴍʙᴇʀ* 23776404155
┃❍┃• *𝖵ᴇʀsɪᴏɴ*: 1.0.0
┃❍└───────────┈⊷
╰──────────────┈⊷
> © 🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1`,
            contextInfo: {
                mentionedJid: [ownerNumber.replace('+', '') + '@s.whatsapp.net'],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029VajbiIfAjPXO45zG2i2c@newsletter',
                    newsletterName: '🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1',
                    serverMessageId: 143
                }
            }
        }, { quoted: verifiedContact });

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/8as3yt.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: verifiedContact });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { 
            text: `❌ An error occurred: ${error.message}` 
        }, { quoted: m });
    }
});
