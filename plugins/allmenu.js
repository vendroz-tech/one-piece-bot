

const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');
const moment = require('moment-timezone');

cmd({
  pattern: "allmenu",
  alias: ["commandlist", "help"],
  desc: "Fetch and display all available bot commands",
  category: "system",
  filename: __filename,
}, async (Void, m, text, { prefix }) => {
  try {
    const commandDir = path.join(__dirname, '../plugins');
    const commandFiles = fs.readdirSync(commandDir).filter(file => file.endsWith('.js'));

    let totalCommands = 0;
    let commandList = [];

    for (const file of commandFiles) {
      const filePath = path.join(commandDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const matches = content.match(/pattern:\s*["'`](.*?)["'`]/g);
      
      if (matches) {
        const extracted = matches.map(x => x.split(':')[1].replace(/["'`,]/g, '').trim());
        totalCommands += extracted.length;
        commandList.push(`🧚‍♀️ *${file}*\n${extracted.map(cmd => `💫 ${cmd}`).join('\n')}`);
      }
    }

    const time = moment().tz('Africa/Kampala').format('HH:mm:ss');
    const date = moment().tz('Africa/Kampala').format('dddd, MMMM Do YYYY');

    const caption = `
╭━━━《 *🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1* 》━━━╮
┃ ✦╭─────────────
┃ ✦│▸ Usᴇʀ       : ᴊ🅰︎🅻︎🅿︎🅷︎🅰︎-🅺︎🅸︎🅽︎🅶︎
┃ ✦│▸ ʙᴀɪʟᴇʏs    : 𝐌𝐮𝐥𝐭𝐢 𝐃𝐞𝐯𝐢𝐜𝐞
┃ ✦│▸ ᴛᴏᴛᴀʟ ᴄᴏᴍᴍᴀɴᴅs:*${totalCommands}*
┃ ✦│▸ ᴘʟᴀᴛғᴏʀᴍ   : ʀᴇɴᴅᴇʀ
┃ ✦│▸ 𝖵ᴇʀsɪᴏɴ    : 1.𝟎.𝟎
┃ ✦╰─────────────
╰━━━━━━━━━━━━┈⊷\n\n${commandList.join('\n\n')}`;

    const messageOptions = {
      image: { url: "https://files.catbox.moe/u9noai.jpg" },
      caption: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: [m.sender],
        forwardedNewsletterMessageInfo: {
          newsletterJid: "0029VajbiIfAjPXO45zG2i2c@newsletter'",
          newsletterName: "🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1",
          serverMessageId: 2
        },
        externalAdReply: {
          title: "🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1",
          body: `ᴘᴏᴡᴇʀᴇᴅ ʙʏ🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1`,
          mediaType: 1,
          thumbnailUrl: "https://files.catbox.moe/u9noai.jpg",
          sourceUrl: "https://github.com/ALPHA-KING-TECH-OFC/TECH-DEVS-V1"
        }
      }
    };

    await Void.sendMessage(m.chat, messageOptions, { quoted: m });
  } catch (err) {
    console.error(err);
    await m.reply('❌ Error: Could not fetch the command list.');
  }
});
