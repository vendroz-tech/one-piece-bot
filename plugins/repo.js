const fetch = require("node-fetch");
const { cmd } = require("../command");

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

cmd({
    pattern: "script",
    alias: ["repo", "sc", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "🎗️",
    category: "info",
    filename: __filename,
}, async (_m, sock, msg, { from }) => {
    const githubRepoURL = "https://github.com/ALPHA-KING-TECH-OFC/TECH-DEVS-V1";

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] =
            githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
        if (!username || !repoName) throw new Error("Invalid GitHub URL format");

        // Fetch repo details
        const response = await fetch(
            `https://api.github.com/repos/${username}/${repoName}`
        );
        if (!response.ok)
            throw new Error(
                `GitHub API request failed with status ${response.status}`
            );
        const repoData = await response.json();

        // Format info
        const formattedInfo = `
*𝐇𝐄𝐋𝐋𝐎 𝐓𝐇𝐄𝐑𝐄* 
──────────────────
📂 *Repository Link:*  
> ${githubRepoURL}
${readMore}
\`BOT NAME:\`
> ${repoData.name}

\`OWNER NAME:\`
> ${repoData.owner.login}

\`STARS:\`
> ${repoData.stargazers_count}

\`FORKS:\`
> ${repoData.forks_count}
──────────────────
\n> *© ʙʏ ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀* 🎐`;

        // Send repo info with image
        await _m.sendMessage(from, {
            image: { url: "https://files.catbox.moe/pvhmgv.jpg" },
            caption: formattedInfo,
            contextInfo: {
                mentionedJid: [msg.sender],
                forwardingScore: 999,
                isForwarded: true,
            },
        });

        // Send audio
        await _m.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/eqfc2j.mp3" },
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo: {
                mentionedJid: [msg.sender],
                forwardingScore: 999,
                isForwarded: true,
            },
        });

        // Contact message for verified context
        const verifiedContact = {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀",
                    vcard: "BEGIN:VCARD\nVERSION:3.0\nFN: ᴊᴇᴘʜᴛᴇʀ ᴛᴇᴄʜ\nORG:ᴊꜰx ᴍᴅ-xᴠ3;\nTEL;type=CELL;type=VOICE;waid=93775551335:+2349046157539\nEND:VCARD"
                }
            }
        };
        
        // Send image + caption + audio combined
        await conn.sendMessage(from, { 
            image: { url: `https://files.catbox.moe/7kl8va.jpg` },  
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '0029VajbiIfAjPXO45zG2i2c@newsletter',
                    newsletterName: '❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀',
                    serverMessageId: 143
                   }
                }
            },
            { quoted: verifiedContact }
        );

    } catch (error) {
        console.error("Error in script command:", error);
        await _m.reply(
            "❌ Sorry, something went wrong while fetching the repository information."
        );
    }
});
