const { cmd } = require("../command");
const fetch = require("node-fetch");

// Verified Contact
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "🅰︎︎🅻︎🅿︎🅷︎🅰︎-🅺︎🅸︎🅽︎🅶︎",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:ᴊꜰx ᴍᴅ-xᴠ3\nORG:ᴊꜰx ᴍᴅ-xᴠ3;\nTEL;type=CELL;type=VOICE;waid=25412192119:+2349046157539\nEND:VCARD"
    }
  }
};

cmd({
  pattern: "gitclone",
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: "📦",
  category: "downloader",
  filename: __filename
}, async (conn, m, match, { from, quoted, args, reply }) => {
  const link = args[0];
  if (!link) return reply("Please provide a GitHub link.\n\nExample:\n.gitclone https://github.com/username/repo");

  if (!/^https:\/\/github\.com\/[^\/]+\/[^\/]+/.test(link)) {
    return reply("⚠️ Invalid GitHub URL.");
  }

  try {
    const repoMatch = link.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i);
    if (!repoMatch) return reply("❌ Couldn't extract repo data.");
    const user = repoMatch[1], repo = repoMatch[2];

    const downloadURL = `https://api.github.com/repos/${user}/${repo}/zipball`;
    const headCheck = await fetch(downloadURL, { method: "HEAD" });

    if (!headCheck.ok) throw new Error("Repository not found.");

    const filenameHeader = headCheck.headers.get("content-disposition");
    const fileName = filenameHeader ? filenameHeader.match(/filename="?(.+?)"?$/)?.[1] : `${repo}.zip`;

    await reply(`
 ╭─〔 *🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1 ɢɪᴛ ᴄʟᴏɴᴇ* 〕─⬣
│
│ 📁 *ᴜꜱᴇʀ:* ${user}
│ 📦 *ʀᴇᴘᴏ:* ${repo}
│ 📎 *ꜰɪʟᴇɴᴀᴍᴇ:* ${fileName}
│
╰───⬣ ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ...`);

    await conn.sendMessage(from, {
      document: { url: downloadURL },
      fileName: fileName,
      mimetype: 'application/zip',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "0029VajbiIfAjPXO45zG2i2c@newsletter",
          newsletterName: "🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1 ɢɪᴛʜᴜʙ ᴄʟᴏɴᴇ 👻",
          serverMessageId: 143
        }
      }
    }, { quoted: quotedContact });

  } catch (e) {
    console.error("❌ GitClone Error:", e);
    return reply("❌ Failed to download repository.\nCheck the link or try later.");
  }
});
