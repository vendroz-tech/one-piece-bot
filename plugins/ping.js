const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
  pattern: "ping",
  alias: ["speed", "pong"],
  use: '.ping',
  desc: "Check bot's response time",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const start = Date.now();

    // Send a temporary ping message
    const sentMsg = await conn.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: m });

    // Calculate latency
    const latencyMs = Date.now() - start;

    let reactionEmoji = '⚡';
    if (latencyMs > 1000) {
      reactionEmoji = '🐢';
    } else if (latencyMs > 500) {
      reactionEmoji = '🔄';
    }

    // Send final latency result
    await conn.sendMessage(from, { 
      text: `
      
      
╔═════ஜ۩۞۩ஜ═════╗
༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-ℝ𝔼𝔹𝕆ℝℕ༒
╚═════ஜ۩۞۩ஜ═════╝
      
> *❀༒𝕋𝔼ℂℍ-𝔻𝔼𝕍𝕊-𝕍1༒❀: ${latencyMs}ms ${reactionEmoji}*
      
      
      `
    }, { quoted: sentMsg });

  } catch (e) {
    console.error("Error in ping command:", e);
    await conn.sendMessage(from, { text: `❌ An error occurred: ${e.message}` }, { quoted: m });
  }
});
