const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
let totalMembers = 0;
let isReady = false;

// Đăng nhập bot với token
client.login(config.DISCORD_TOKEN).catch((error) => {
  console.error("Error logging in to Discord:", error);
  isReady = false; // Đánh dấu bot không sẵn sàng
});

client.once("ready", () => {
  console.info("Discord bot is ready!");
  isReady = true; // Đánh dấu bot đã sẵn sàng
  updateMemberCount();
});

client.on("error", (error) => {
  console.error("Discord client encountered an error:", error);
  isReady = false; // Đánh dấu bot không sẵn sàng
});

function updateMemberCount() {
  totalMembers = client.guilds.cache.reduce(
    (acc, guild) => acc + guild.memberCount,
    0
  );
  console.info(`Updated total members: ${totalMembers}`);
}

setInterval(updateMemberCount, 5 * 60 * 1000);

// Xuất client và biến isReady
module.exports = { getTotalMembers: () => totalMembers, client, isReady };
