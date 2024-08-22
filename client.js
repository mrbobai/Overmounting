// client.js
require("dotenv").config();
const { Client, Collection, IntentsBitField } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();

module.exports = client;

client.login(token);

