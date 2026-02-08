const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 

cmd({
    pattern: "play3",
    alias: ["audio2","song2","ytsong"],
    react: "🎶",
    desc: "Download Youtube song",
    category: "main",
    use: '.song < Yt url or Name >',
    filename: __filename
},
async(conn, mek, m,{ from, prefix, quoted, q, reply }) => {
try {
    if(!q) return await reply("Please give me Yt url or Name");
    
    const yt = await ytsearch(q);
    if(yt.results.length < 1) return reply("Results not found!");
    
    let yts = yt.results[0];  
    const ytdl = await ytmp3(yts.url);
    
    // Validate download URL
    if(!ytdl?.download?.url) return reply("Error fetching audio URL");
    
    let ytmsg = `
 ╭━━━〔 *❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀* 〕━━┈⊷

  ๏ *MUSIC DOWNLOADER*
┇๏ *Title* -  ${yts.title}
┇๏ *Duration* - ${yts.timestamp}
┇๏ *Views* -  ${yts.views}
┇๏ *Author* -  ${yts.author.name} 
┇๏ *Link* -  ${yts.url}
╰━━❑━⪼
> *© ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀ ♡*`;

    // Send details with thumbnail
    await conn.sendMessage(from, { 
        image: { url: yts.thumbnail || yts.image || '' }, 
        caption: ytmsg 
    }, { quoted: mek });
    
    // Send as audio message
    await conn.sendMessage(from, { 
        audio: { url: ytdl.download.url }, 
        mimetype: "audio/mpeg",
        ptt: false
    }, { quoted: mek });
    
    // Send as document
    await conn.sendMessage(from, {
        document: { url: ytdl.download.url },
        mimetype: "audio/mpeg",
        fileName: `${yts.title.replace(/[^a-zA-Z0-9]/g, '_')}.mp3`, // Sanitize filename
        caption: `> *© By ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀*`
    }, { quoted: mek });
    
} catch (e) {
    console.error(e);
    reply("Error processing request: " + e.message);
}});
