const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config");
const logger = require("./logger");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});
let totalMembers = 0;

client.once("ready", () => {
  logger.info("Discord bot is ready!");
  updateMemberCount();
});

function updateMemberCount() {
  totalMembers = client.guilds.cache.reduce(
    (acc, guild) => acc + guild.memberCount,
    0
  );
  logger.info(`Updated total members: ${totalMembers}`);
}

setInterval(updateMemberCount, 5 * 60 * 1000);

client.login(config.DISCORD_TOKEN);

module.exports = { getTotalMembers: () => totalMembers };
