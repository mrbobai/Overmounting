require("dotenv").config();
require("axios");
const { Client, IntentsBitField } = require("discord.js");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", async () => {
  console.log(`I am online and ready as ${client.user.username}`);
  await regAllCmd();

  // Get the bot-testing channel by name
  const botTestingChannel = client.channels.cache.find(channel => channel.name === 'bot-testing');

  // Check if the channel is found
  if (botTestingChannel) {
    // Send a message in the bot-testing channel
    botTestingChannel.send('I am now in use!');
    console.log('Message sent to bot-testing channel.');
  } else {
    console.error('Bot-testing channel not found!');
  }
});

async function regAllCmd() {
  client.guilds.cache.forEach((guild) => {
    guild.commands
      .set(commands)
      .then(() => {
        console.log(`Commands deployed in ${guild.name} successfully!`);
      })
      .catch((error) => {
        console.error(
          `Error deploying commands in ${guild.name}: ${error.message}`
        );
      });
  });
}

client.on("guildCreate", async (guild) => {
  guild.commands
    .set(commands)
    .then(() => console.log(`Bot added to the guild ${guild.name}!`));
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "help") {
    try {
      const CommandList = await getCommands(commands);
      await interaction.reply(CommandList);
    } catch (error) {
      console.error("Error while getting commands:", error);
      await interaction.reply("error with function: getCommands");
    }

    async function getCommands(commands) {
      let StringCommands = "/";
      try {
        for (let track = 0; track < commands.length; track++) {
          StringCommands +=
            commands[track].name + (track < commands.length - 1 ? " /" : "");
        }
        return StringCommands;
      } catch (error) {
        throw Error;
      }
    }
  }

  if (interaction.commandName === "weather") {
    async function fetchWeather() {
      try {
        const axios = require("axios");
        const response = await axios.get(
          "https://api.open-meteo.com/v1/forecast?latitude=59.92&longitude=5.45&hourly=temperature_2m,precipitation_probability,precipitation&current_weather=true&forecast_days=1&timezone=auto"
        );
        return response.data;
      } catch (error) {
        console.error("Error while fetching weather:", error);
        await interaction.reply("error with function: fetchWeather");
      }
    }

    async function returnWeather() {
      const weatherData = await fetchWeather();
      try {
        if (weatherData) {
          const temperature =
            Math.round(weatherData.current_weather.temperature) + 4.5;
          const windSpeed = weatherData.current_weather.windspeed;
          const responseText = `${temperature} °C, ${windSpeed} km/h`;
          await interaction.reply(responseText);
        }
      } catch (error) {
        console.error("Error while returning weather:", error);
        await interaction.reply("error with function: returnWeather");
      }
    }

    returnWeather();
  }

  if (interaction.commandName === "coin-flip") {
    async function getCoin() {
      return Math.floor(Math.random() * 2) + 1;
    }

    try {
      const result = await getCoin();
      const response = result === 1 ? "Head Wins!" : "Tails Wins!";
      await interaction.reply(response);
    } catch (error) {
      console.error("Error while getting coin:", error);
      await interaction.reply("error with function: getCoin");
    }
  }

  if (interaction.commandName === "random-number") {
    try {
      const min = parseInt(interaction.options.getString("min"));
      const max = parseInt(interaction.options.getString("max"));

      if (min > max) {
        return await interaction.reply(
          "Please provide valid values for both min and max."
        );
      }

      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      const responseMessage = `from ${min} | to ${max} | ${randomNumber}`;

      await interaction.reply(responseMessage);
    } catch (error) {
      console.error("error with random-number command", error);
      await interaction.reply("Error while generating random number");
    }
  }

  if (interaction.commandName === "tic-tac-toe") {
    const { TicTacToe } = require('discord-gamecord');

    const Game = new TicTacToe({
      message: interaction,
      isSlashGame: true,
      opponent: interaction.options.getUser('user'), // Fixed the typo here
      embed: {
        title: 'Tic Tac Toe',
        color: '#5865F2',
        statusTitle: 'Status',
        overTitle: 'Game Over'
      },
      emojis: {
        xButton: '❌',
        oButton: '🔵',
        blankButton: '➖'
      },
      mentionUser: true,
      timeoutTime: 60000,
      xButtonStyle: 'DANGER',
      oButtonStyle: 'PRIMARY',
      turnMessage: '{emoji} | Its turn of player **{player}**.',
      winMessage: '{emoji} | **{player}** won the TicTacToe Game.',
      tieMessage: 'The Game tied! No one won the Game!',
      timeoutMessage: 'The Game went unfinished! No one won the Game!',
      playerOnlyMessage: 'Only {player} and {opponent} can use these buttons.'
    });

    Game.startGame();
    Game.on('gameOver', result => {
      console.log(result);  // =>  { result... }
    });
  }
});

const commands = [
  {
    name: "tic-tac-toe",
    description: "Get ready to face off in the classic game of Tic-Tac-Toe!",
  },
  {
    name: "weather",
    description: "Current temp and wind for Stord",
  },
  {
    name: "coin-flip",
    description: "flips a coin",
  },
  {
    name: "random-number",
    description: "random number min-max",
    options: [
      {
        type: 3,
        name: "min",
        description: "The minimum value",
        required: true,
      },
      {
        type: 3,
        name: "max",
        description: "The maximum value",
        required: true,
      },
    ],
  },
  {
    name: "help",
    description: "says all the commands",
  },
];

client.login(process.env.token);

