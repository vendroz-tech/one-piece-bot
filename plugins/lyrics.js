const fetch = require('node-fetch');

async function lyricsCommand(sock, chatId, songTitle, message) {
    if (!songTitle) {
        await sock.sendMessage(chatId, { 
            text: 'ᴘʟᴇᴀꜱᴇ ᴇɴᴛᴇʀ ᴛʜᴇ ꜱᴏɴɢ ɴᴀᴍᴇ ᴛᴏ ɢᴇᴛ ᴛʜᴇ ʟʏʀɪᴄꜱ!\n\nᴜꜱᴀɢᴇ: ʟʏʀɪᴄꜱ <ꜱᴏɴɢ ɴᴀᴍᴇ>'
        }, { quoted: message });
        return;
    }

    try {
        const apiUrl = `https://lyricsapi.fly.dev/api/lyrics?q=${encodeURIComponent(songTitle)}`;
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error(`API returned ${res.status}`);

        const data = await res.json();

        const title = data.title || songTitle;
        const artist = data.artist || "Unknown Artist";
        const lyrics = data.lyrics || null;

        if (!lyrics) {
            await sock.sendMessage(chatId, {
                text: `❌ Sorry, no lyrics found for *"${songTitle}"*`
            }, { quoted: message });
            return;
        }

        // Limit WhatsApp message length
        const maxChars = 4000;
        const output = lyrics.length > maxChars ? lyrics.slice(0, maxChars - 3) + "..." : lyrics;

        await sock.sendMessage(chatId, { 
            text: `🎶 *${title}* - ${artist}\n\n${output}`
        }, { quoted: message });

    } catch (error) {
        console.error("Lyrics Command Error:", error);
        await sock.sendMessage(chatId, { 
            text: `⚠️ An error occurred while fetching lyrics for *"${songTitle}"*.`
        }, { quoted: message });
    }
}

module.exports = { lyricsCommand };
