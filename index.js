// index.js
const fs = require("node:fs");
const path = require("node:path");
const { Events } = require("discord.js");
const client = require("./client");

// __dirname is defined
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file =>
    file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true
      });
    }
  }
});

client.on("ready", async () => {
  const botTestingChannel = client.channels.cache.find(channel =>
    channel.name === "bot-testing");
  if (botTestingChannel) {
    botTestingChannel.send("I am now in use!");
    console.log("Message sent to bot-testing channel.");
  } else {
    console.error("Bot-testing channel not found!");
  }
});

