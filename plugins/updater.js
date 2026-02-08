
const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ This command is only for the bot owner.");

    try {
        // Newsletter configuration
        const newsletterConfig = {
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
        };

        // Initial update check message with newsletter
        await conn.sendMessage(from, {
            text: "🔍 *Checking for VERONICA-AI updates...*",
            ...newsletterConfig
        }, { quoted: mek });

        // Fetch the latest commit hash from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/Jeffreyfx1/jfx-md-x-v3/commits/main");
        const latestCommitHash = commitData.sha;
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return await conn.sendMessage(from, {
                text: "ᴊꜰx ᴍᴅ-xᴠ3 is already up-to-date!*",
                ...newsletterConfig
            }, { quoted: mek });
        }

        // Update progress message
        await conn.sendMessage(from, {
            text: "🚀 *Updating ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀ Bot...*\n\n_This may take a few moments..._",
            ...newsletterConfig
        }, { quoted: mek });

        // Download the latest code
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/ALPHA-KING-TECH-OFC/TECH-DEVS-V1/archive/main.zip", { 
            responseType: "arraybuffer",
            headers: {
                'User-Agent': 'ᴊꜰx ᴍᴅ-xᴠ3'
            }
        });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP file
        await conn.sendMessage(from, {
            text: "📦 *Extracting the latest code...*",
            ...newsletterConfig
        }, { quoted: mek });

        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copy updated files
        await conn.sendMessage(from, {
            text: "🔄 *Replacing files while preserving your config...*",
            ...newsletterConfig
        }, { quoted: mek });

        const sourcePath = path.join(extractPath, "VERONICA-AI-main");
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Save the latest commit hash
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        // Send initial progress message
        let progressMessage = await conn.sendMessage(from, {
            text: "🔄 Installing updates: [▒▒▒▒▒▒▒▒] 0%",
            ...newsletterConfig
        }, { quoted: mek });

        // Update progress in the same message
        const progressStages = [
            "🔄 Installing updates: [████▒▒▒▒] 40%",
            "🔄 Installing updates: [██████▒▒] 70%",
            "🔄 Installing updates: [████████] 100%"
        ];
        
        for (const progress of progressStages) {
            await new Promise(resolve => setTimeout(resolve, 800));
            // Edit the message with new progress
            await conn.sendMessage(from, {
                text: progress,
                edit: progressMessage.key,
                ...newsletterConfig
            }, { quoted: mek });
        }

        // Final success message with image (this will be a new message)
        await conn.sendMessage(from, {
            image: { 
                url: "https://files.catbox.moe/j5jjt6.jpg",
                mimetype: "image/jpeg"
            },
            caption: "✅ *Update complete!*\n\n_Restarting the bot to apply changes..._\n\by ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀",
            ...newsletterConfig
        }, { quoted: mek });

        // Restart the bot
        process.exit(0);
    } catch (error) {
        console.error("Update error:", error);
        await conn.sendMessage(from, {
            text: `❌ *Update failed!*\n\nError: ${error.message}\n\nPlease try manually or contact support.`,
            ...newsletterConfig
        }, { quoted: mek });
    }
});

// Improved directory copy function
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip sensitive files
        const preservedFiles = ["config.js", "app.json", "credentials.json", "data"];
        if (preservedFiles.includes(item)) {
            console.log(`⚠️ Preserving existing file: ${item}`);
            continue;
        }

        try {
            const stat = fs.lstatSync(srcPath);
            if (stat.isDirectory()) {
                copyFolderSync(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        } catch (copyError) {
            console.error(`Failed to copy ${item}:`, copyError);
        }
    }
}

cmd({
    pattern: "checkupdate",
    alias: ["checkupgrade", "updatecheck"],
    react: '🔍',
    desc: "Check if there are any updates available for the bot.",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, isOwner }) => {
    if (!isOwner) return reply("❌ This command is only for the bot owner.");

    try {
        // Newsletter configuration
        const newsletterConfig = {
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
        };

        // Initial check message
        await conn.sendMessage(from, {
            text: "🔍 *Checking for ❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀ updates...*",
            ...newsletterConfig
        }, { quoted: mek });

        // Fetch the latest commit info from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/ALPHA-KING-TECH-OFC/TECH-DEVS-V1/commits/main", {
            headers: {
                'User-Agent': '❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀'
            }
        });
        
        const latestCommitHash = commitData.sha;
        const latestCommitMessage = commitData.commit.message;
        const commitDate = new Date(commitData.commit.committer.date).toLocaleString();
        const author = commitData.commit.author.name;
        
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return await conn.sendMessage(from, {
                text: `✅ *❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀ is up-to-date!*\n\n*Current Version:* \`${currentHash.substring(0, 7)}\`\n*Last Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}`,
                ...newsletterConfig
            }, { quoted: mek });
        }

        // Get commit comparison to show what's new
        let changelog = "";
        try {
            const { data: compareData } = await axios.get(`https://api.github.com/repos/ALPHA-KING-TECH-OFC/TECH-DEVS-V1/compare/${currentHash}...${latestCommitHash}`, {
                headers: {
                    'User-Agent': '❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀'
                }
            });
            
            if (compareData.commits && compareData.commits.length > 0) {
                changelog = "\n\n*What's New:*\n";
                compareData.commits.slice(0, 5).forEach(commit => {
                    changelog += `• ${commit.commit.message.split('\n')[0]}\n`;
                });
                
                if (compareData.commits.length > 5) {
                    changelog += `• ...and ${compareData.commits.length - 5} more changes\n`;
                }
            }
        } catch (error) {
            console.log("Could not fetch detailed changelog:", error.message);
        }

        // Update available message
        await conn.sendMessage(from, {
            text: `🆕 *Update Available!*\n\n*Current Version:* \`${currentHash ? currentHash.substring(0, 7) : "Unknown"}\`\n*Latest Version:* \`${latestCommitHash.substring(0, 7)}\`\n*Last Commit:* ${latestCommitMessage}\n*Date:* ${commitDate}\n*Author:* ${author}${changelog}\n\nUse *.update* to install the latest version.`,
            ...newsletterConfig
        }, { quoted: mek });

    } catch (error) {
        console.error("Update check error:", error);
        await conn.sendMessage(from, {
            text: `❌ *Failed to check for updates!*\n\nError: ${error.message}\n\nPlease try again later.`
        }, { quoted: mek });
    }
});
