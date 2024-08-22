const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("meeting")
    .setDescription("Plan a meeting")

    .addNumberOption(option =>
      option.setName("hour")
        .setDescription("The hour of your meeting (0-23)")
        .setRequired(true)
        .addChoices(
          { name: "00", value: 0 },
          { name: "01", value: 1 },
          { name: "02", value: 2 },
          { name: "03", value: 3 },
          { name: "04", value: 4 },
          { name: "05", value: 5 },
          { name: "06", value: 6 },
          { name: "07", value: 7 },
          { name: "08", value: 8 },
          { name: "09", value: 9 },
          { name: "10", value: 10 },
          { name: "11", value: 11 },
          { name: "12", value: 12 },
          { name: "13", value: 13 },
          { name: "14", value: 14 },
          { name: "15", value: 15 },
          { name: "16", value: 16 },
          { name: "17", value: 17 },
          { name: "18", value: 18 },
          { name: "19", value: 19 },
          { name: "20", value: 20 },
          { name: "21", value: 21 },
          { name: "22", value: 22 },
          { name: "23", value: 23 }
        )
    )

    .addNumberOption(option =>
      option.setName("min")
        .setDescription("The minutes of your meeting (0-55) in 5-minute increments")
        .setRequired(true)
        .addChoices(
          { name: "00", value: 0 },
          { name: "05", value: 5 },
          { name: "10", value: 10 },
          { name: "15", value: 15 },
          { name: "20", value: 20 },
          { name: "25", value: 25 },
          { name: "30", value: 30 },
          { name: "35", value: 35 },
          { name: "40", value: 40 },
          { name: "45", value: 45 },
          { name: "50", value: 50 },
          { name: "55", value: 55 }
        )
    )

    .addNumberOption(option =>
      option.setName("day")
        .setDescription("The day of your meeting")
        .setRequired(true)
        .setMaxValue(31)
    )

    .addStringOption(option =>
      option.setName("month")
        .setDescription("The month of your meeting")
        .setRequired(true)
        .addChoices(
          { name: "January", value: "January" },
          { name: "February", value: "February" },
          { name: "March", value: "March" },
          { name: "April", value: "April" },
          { name: "May", value: "May" },
          { name: "June", value: "June" },
          { name: "July", value: "July" },
          { name: "August", value: "August" },
          { name: "September", value: "September" },
          { name: "October", value: "October" },
          { name: "November", value: "November" },
          { name: "December", value: "December" }
        )
    )

    .addUserOption(option =>
      option.setName("user")
        .setDescription("User you want in the meeting")
        .setRequired(true)
    )

    .addUserOption(option =>
      option.setName("user2")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user3")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user4")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user5")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user6")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user7")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user8")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user9")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addUserOption(option =>
      option.setName("user10")
        .setDescription("Another user you want in the meeting")
        .setRequired(false)
    )

    .addBooleanOption(option =>
      option.setName("all")
        .setDescription("Do you want everyone in the meeting?")
        .setRequired(false)
    ),

  async execute(interaction) {
    try {
      const MAll = (interaction.options.getBoolean("all")) ?? false;
      const MHour = (interaction.options.getNumber("hour"));
      const MMin = (interaction.options.getNumber("min"));
      const MDay = (interaction.options.getNumber("day"));
      const MMonth = (interaction.options.getString("month"));

      let MReply ="";
      let i;
      let MUsers;

      if (MAll == true) {
        if (interaction.guild.members.me.permissions.has(
          PermissionsBitField.Flags.MentionEveryone)) {
          MReply = "@everyone ";
        }
        else {
          MReply = "mising permissions to mention everyone ";
        }
      }
      else {
        MReply += await makeReply();
      }

      async function makeReply()
      {
        const MRequiredUser = (interaction.options.getUser("user"));
        let Reply ="";
        Reply += "<@" + MRequiredUser + "> ";
        MUsers = await getUsers();

        for(i = 2; i < 11; i++) {
          if(MUsers[i] != "") {
            Reply += "<@" + MUsers[i] + ">";
          }
        }
        return Reply;
      }

      async function getUsers(){
        const Users = [];
        for(i = 2; i < 11; i++) {
          Users[i] = (interaction.options.getUser("user" + i)) ?? "";
        }
        return Users;
      }

      await interaction.reply({
        content: MReply,
        allowedMentions: { parse: ["everyone", "users"] }
      });

      interaction.channel.send(" can you join the meeting at "+ MHour + ":"+ MMin + " " + MDay + " " + MMonth + "?").then(sentMessage => {
        sentMessage.react("✅");
        sentMessage.react("❌");
      });
    } catch (error) {
      console.error(error);
    }
  }
};

