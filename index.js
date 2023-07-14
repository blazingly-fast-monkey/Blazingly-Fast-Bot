const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
const { channel } = require('diagnostics_channel');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent] });


let blacklist = ["232239924462616578"]

function readLeaderboard() {
    try {
      const leaderboardData = fs.readFileSync('lb.json');
      const leaderboard = JSON.parse(leaderboardData) || []; // Return the parsed JSON data or an empty array
      return leaderboard;
    } catch (error) {
      return []; // Return an empty array if there is an error
    }
}

function writeLeaderboard(leaderboard) {
    fs.writeFileSync('lb.json', JSON.stringify(leaderboard));
}

function addScore(name, score, isBot) {
    const leaderboard = readLeaderboard();
    let found = false;

    if (isBot === true) return;
  
    for (let i = 0; i < leaderboard.length; i++) {
      if (leaderboard[i].name === name) {
        leaderboard[i].score += score; // Update the existing score
        found = true;
        break;
      }
    }
  
    if (!found) {
      leaderboard.push({ name, score }); // Add a new score if the name doesn't exist
    }
  
    leaderboard.sort((a, b) => b.score - a.score);
    writeLeaderboard(leaderboard);
}

function removeScore(name, score) {
  const leaderboard = readLeaderboard();
  let found = false;

  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].name === name) {
      leaderboard[i].score -= score; // Update the existing score
      found = true;
      break;
    }
  }

  if (!found) {
    leaderboard.push({ name, score }); // Add a new score if the name doesn't exist
  }

  leaderboard.sort((a, b) => b.score - a.score);
  writeLeaderboard(leaderboard);
}

function resetScore(name) {
  const leaderboard = readLeaderboard();
  let found = false;
  let score = 0;

  for (let i = 0; i < leaderboard.length; i++) {
    if (leaderboard[i].name === name) {
      leaderboard[i].score = score; // Update the existing score
      found = true;
      break;
    }
  }

  if (!found) {
    leaderboard.push({ name, score }); // Add a new score if the name doesn't exist
  }

  leaderboard.sort((a, b) => b.score - a.score);
  writeLeaderboard(leaderboard); 
}

client.on(Events.MessageCreate, async message => {
    let arr = message.content.toLowerCase().split(" ");
    if (arr.indexOf("blazingly") === 0 || arr.indexOf("blazing") === 0) {
        if ((message.content.toLowerCase().includes("blazingly ") || message.content.toLowerCase().includes("blazing ")) && message.content.toLowerCase().includes(" fast")) {
            if (arr.indexOf("fast") > (arr.indexOf("blazingly")|| arr.indexOf("blazing"))) {

                let blacklisted = false;

                blacklist.forEach(user => {
                  if (message.author.id === user) {
                    blacklisted = true;
                  }
                })

                if (blacklisted === false) {
                  addScore(message.author.id, 1, message.author.bot);
                }

                try {
                  message.react("🚀");
                  await message.react("🔥");
                } catch (e) {
                  console.log(e);
                }
            }
        }
    } else {
        if ((message.content.toLowerCase().includes(" blazingly ") || message.content.toLowerCase().includes(" blazing ")) && message.content.toLowerCase().includes(" fast")) {
            if (arr.indexOf("fast") > (arr.indexOf("blazingly")|| arr.indexOf("blazing"))) {

                let blacklisted = false;
                
                blacklist.forEach(user => {
                  if (message.author.id === user) {
                    blacklisted = true;
                  }
                })

                if (blacklisted === false) {
                  addScore(message.author.id, 1, message.author.bot);
                }

                try {
                  message.react("🚀");
                  await message.react("🔥");
                } catch (e) {
                  console.log(e);
                }
            }
        }
    }
    if (message.content.includes("zickles") && message.author.id === "468043261911498767") {
      if(message.content.includes("https://zickles")) return;
      message.react("🇮")
      await message.react("💙")
      await message.react("🇿")
      await message.react("ℹ️")
      await message.react("🇨")
      await message.react("🇰")
      await message.react("🇱")
      await message.react("🇪")
      await message.react("🇸")
    }
  try {
      if (message.content.includes("<@1128487104679264337>")) {
      message.channel.send("no go ping nopo");
      }
    } catch (e) {
    console.log(e);
  }
});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "leaderboard") {
    const lbembed = new EmbedBuilder().setTitle("Blazingly Fast Leaderboard");
    const leaderboard = readLeaderboard();
    let count = 0;
    let list = "";
    
    leaderboard.forEach((entry, index) => {
      if (count < 10) {
        list = list + `${index + 1}. <@${entry.name}>: ${entry.score}\n`
        count += 1
      }
    });

    lbembed.setDescription(list);

    interaction.reply({embeds: [lbembed]})
  }
  if (interaction.commandName === "reset") {
    const user = interaction.options.getUser("user");

    if (interaction.user.id != "468043261911498767") return interaction.reply({content: `You can not use this!`, ephemeral: true})

    resetScore(user.username);

    interaction.reply({content: `${user.username}'s score has been reset!`, ephemeral: true})
  }
  if (interaction.commandName === "add") {
    const user = interaction.options.getUser("user");
    const number = interaction.options.getNumber("number");

    if (interaction.user.id != "468043261911498767") return interaction.reply({content: `You can not use this!`, ephemeral: true})

    addScore(user.username, number, false);

    interaction.reply({content: `Added score!`, ephemeral: true})
  }
  if (interaction.commandName === "remove") {
    const user = interaction.options.getUser("user");
    const number = interaction.options.getNumber("number");

    if (interaction.user.id != "468043261911498767") return interaction.reply({content: `You can not use this!`, ephemeral: true})

    removeScore(user.username, number);

    interaction.reply({content: `Removed score!`, ephemeral: true})
  }
  if (interaction.commandName === "say") {
    const channel = interaction.options.getChannel("channel");

    if (interaction.user.id != "468043261911498767") return interaction.reply({content: `You can not use this!`, ephemeral: true})

    if (!interaction.appPermissions.has("SendMessages")) return interaction.reply({content: `I do not have perms to send messages here!`, ephemeral: true})

    try {
    channel.send(interaction.options.getString("say"));
    interaction.reply({content: "Sent!", ephemeral: true})
    } catch (e) {
      console.log(e);
    }
  }
});

client.login(token);