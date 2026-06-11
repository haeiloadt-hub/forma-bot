require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const QUEUE_CHANNEL_ID = "1514597081296142489";

let queue = [];

const MATCH_CATEGORY_ID =
"1514598179507535945";

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = await client.channels.fetch(
    QUEUE_CHANNEL_ID
  );

  const embed = new EmbedBuilder()
    .setTitle("🎮 FORMA Matchmaking")
    .setDescription(
      "Queue Size: 0/10\n\nClick Join Queue to play."
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("join")
      .setLabel("Join Queue")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("leave")
      .setLabel("Leave Queue")
      .setStyle(ButtonStyle.Danger)
  );

  await channel.send({
    embeds: [embed],
    components: [row]
  });
});

client.on(
  Events.InteractionCreate,
  async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "join") {
      if (!queue.includes(interaction.user.id)) {
        queue.push(interaction.user.id);
      }

      await interaction.reply({
        content: `Joined Queue (${queue.length}/10)`,
        ephemeral: true
      });
    }

    if (queue.length >= 10) {

  await createMatch(
    interaction.guild
  );

}

    if (interaction.customId === "leave") {
      queue = queue.filter(
        id => id !== interaction.user.id
      );

      await interaction.reply({
        content: "You left the queue.",
        ephemeral: true
      });
    }
  }
);

async function createMatch(guild) {

  const players = [...queue];

  queue = [];

  const host =
    players[Math.floor(Math.random() * players.length)];

  const channel = await guild.channels.create({
    name: `match-${Date.now()}`,
    parent: MATCH_CATEGORY_ID
  });

  await channel.send(`
🎮 MATCH CREATED

Host:
<@${host}>

Players:

${players.map(id => `<@${id}>`).join("\n")}
`);
}

client.login(process.env.TOKEN);
