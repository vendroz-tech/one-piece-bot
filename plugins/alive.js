const { cmd } = require('../command');
const config = require('../config');   // bot config (owner number, prefix, etc.)
const os = require("os");              // Node.js system module (gives RAM, CPU, OS info)

cmd({
  pattern: "ping",
  alias: ["speed", "pong"],
  use: '.ping',
  desc: "Check bot's response time & system status",
  category: "main",
  react: "⚡",
  filename: __filename
}, 
async (conn, mek, m, { from, pushname, reply }) => {
  try {
    const start = Date.now();
    await reply("🏓 Pinging...");
    const latencyMs = Date.now() - start;

    let reactionEmoji = '⚡';
    if (latencyMs > 1000) reactionEmoji = '🐢';
    else if (latencyMs > 500) reactionEmoji = '🔄';

    const platform = "ʀᴇɴᴅᴇʀ ᴘʟᴀᴛꜰᴏʀᴍ";
    const release = os.release();
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0); 
    const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);
    const nodeVer = process.version;

    const status = `⚡ *ᴘɪɴɢ ʀᴇꜱᴜʟᴛ* ⚡
╭─❰ *🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1* ❱─
┃ *𝖫ᴀᴛᴇɴᴄʏ* : *${latencyMs}ms ${reactionEmoji}*
┃ *𝖱ᴀᴍ* : *${usedMem}MB / ${totalMem}MB*
┃ *𝖮ꜱ* : *${release}*
┃ *𝖯ʟᴀᴛꜰᴏʀᴍ* : *${platform}*
┃ *𝖫ᴀɴɢᴜᴀɢᴇ* : *Node.js ${nodeVer}*
┃ *𝖧ᴏꜱᴛɪɴɢ* : *Render*
╰───────────┈⊷
> ʙʏ 🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1`;

    const verifiedContact = {
      key: {
        fromMe: false,
        participant: `0@s.whatsapp.net`,
        remoteJid: "status@broadcast"
      },
      message: {
        contactMessage: {
          displayName: "🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1",
          vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: ᴊᴇᴘʜᴛᴇʀ ᴛᴇᴄʜ\nORG:ᴊꜰx ᴍᴅ-xᴠ3;\nTEL;type=CELL;type=VOICE;waid=2349046157539:+2349046157539\nEND:VCARD"
        }
      }
    };

    await conn.sendMessage(from, { 
      image: { url: `https://files.catbox.moe/u9noai.jpg` },  
      caption: status,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '0029VajbiIfAjPXO45zG2i2c@newsletter',
          newsletterName: '🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1',
          serverMessageId: 143
        }
      }
    }, { quoted: verifiedContact });

  } catch (e) {
    console.error("Error in ping command:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
