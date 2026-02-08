const { cmd } = require("../command");
const config = require("../config");

const recentCallers = new Set();

// Anti-call event handler
cmd({ on: "body" }, async (client, message, chat, { from: sender }) => {
  try {
    client.ev.on("call", async (callData) => {
      if (!config.ANTI_CALL) return;

      for (const call of callData) {
        if (call.status === 'offer' && !call.isGroup) {
          await client.rejectCall(call.id, call.from);
          
          if (!recentCallers.has(call.from)) {
            recentCallers.add(call.from);
            
            await client.sendMessage(call.from, {
              text: "```ʜɪɪ ᴛʜɪꜱ ɪꜱ 🆃︎🅴︎🅲︎🅷︎-🅳︎🅴︎🆅︎🆂︎-🆅︎1 ᴀ ᴘᴇʀꜱᴏɴᴀʟ ᴀꜱꜱɪꜱᴛᴀɴᴛ!! ꜱᴏʀʀʏ ꜰᴏʀ ɴᴏᴡ, ᴡᴇ ᴄᴀɴɴᴏᴛ ʀᴇᴄᴇɪᴠᴇ ᴄᴀʟʟꜱ, ᴡʜᴇᴛʜᴇʀ ɪɴ ᴀ ɢʀᴏᴜᴘ ᴏʀ ᴘᴇʀꜱᴏɴᴀʟ ɪꜰ ʏᴏᴜ ɴᴇᴇᴅ ʜᴇʟᴘ ᴏʀ ʀᴇQᴜᴇꜱᴛ ꜰᴇᴀᴛᴜʀᴇꜱ ᴘʟᴇᴀꜱᴇ ᴄʜᴀᴛ ᴏᴡɴᴇʀ```",
              mentions: [call.from]
            });
            
            setTimeout(() => recentCallers.delete(call.from), 600000);
          }
        }
      }
    });
  } catch (error) {
    console.error("Call rejection error:", error);
    await client.sendMessage(sender, { text: "⚠️ Error: " + error.message }, { quoted: chat });
  }
});

// Anti-call command with combined image+newsletter response
cmd({
    pattern: "anticall",
    alias: ["callblock", "togglecall"],
    desc: "Toggle call blocking feature",
    category: "owner",
    react: "📞",
    filename: __filename,
    fromMe: true
},
async (client, message, m, { isOwner, from, sender, args, prefix }) => {
    try {
        if (!isOwner) {
            return client.sendMessage(from, { 
                text: "ᴏᴡɴᴇʀ-ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ",
                mentions: [sender]
            }, { quoted: message });
        }

        const action = args[0]?.toLowerCase() || 'status';
        let statusText, reaction = "📞", additionalInfo = "";

        switch (action) {
            case 'on':
                if (config.ANTI_CALL) {
                    statusText = "ᴀɴᴛɪ-ᴄᴀʟʟ ɪꜱ ᴀʟʀᴇᴀᴅʏ *ᴇɴᴀʙʟᴇᴅ*";
                    reaction = "ℹ️";
                } else {
                    config.ANTI_CALL = true;
                    statusText = "ᴀɴᴛɪ-ᴄᴀʟʟ ʜᴀꜱ ʙᴇᴇɴ *ᴇɴᴀʙʟᴇᴅ*!";
                    reaction = "✅";
                    additionalInfo = "ᴄᴀʟʟꜱ ᴡɪʟʟ ʙᴇ ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ ʀᴇᴊᴇᴄᴛᴇᴅ";
                }
                break;
                
            case 'off':
                if (!config.ANTI_CALL) {
                    statusText = "Anti-call is already *disabled*📳!";
                    reaction = "ℹ️";
                } else {
                    config.ANTI_CALL = false;
                    statusText = "ᴀɴᴛɪ-ᴄᴀʟʟ ʜᴀꜱ ʙᴇᴇɴ *ᴅɪꜱᴀʙʟᴇᴅ*!";
                    reaction = "❌";
                    additionalInfo = "ᴄᴀʟʟꜱ ᴡɪʟʟ ʙᴇ ᴀᴄᴄᴇᴘᴛᴇᴅ";
                }
                break;
                
            default:
                statusText = `ᴀɴᴛɪ-ᴄᴀʟʟ Sᴛᴀᴛᴜs: ${config.ANTI_CALL ? "✅ *ᴇɴᴀʙʟᴇᴅ*" : "❌ *ᴅɪꜱᴀʙʟᴇᴅ*"}`;
                additionalInfo = config.ANTI_CALL ? "Calls are being blocked" : "Calls are allowed";
                break;
        }

        // Send the combined message with image and newsletter info
        await client.sendMessage(from, {
            image: { url: "https://files.catbox.moe/tejxaj.jpg" },
            caption: `${statusText}\n\n${additionalInfo}\n\n_ᴊꜰx ᴍᴅ-xᴠ3_`,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363420646690174@newsletter',
                    newsletterName: 'ᴊꜰx ᴍᴅ-xᴠ3',
                    serverMessageId: 143
                }
            }
        }, { quoted: message });

        // Add reaction to original message
        await client.sendMessage(from, {
            react: { text: reaction, key: message.key }
        });

    } catch (error) {
        console.error("Anti-call command error:", error);
        await client.sendMessage(from, {
            text: `⚠️ Error: ${error.message}`,
            mentions: [sender]
        }, { quoted: message });
    }
});
