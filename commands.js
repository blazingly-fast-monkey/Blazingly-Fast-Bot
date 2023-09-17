const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [new SlashCommandBuilder().setName("leaderboard").setDescription("displays a leaderboard of who has said blazingly/blazing fast the most"), 
new SlashCommandBuilder().setName("reset").setDescription("reset a player's lb score").addUserOption(option => option.setName("user").setDescription("user to reset score of")),
new SlashCommandBuilder().setName("add").setDescription("add some amount to a player's lb score").addUserOption(option => option.setName("user").setDescription("user to add score to")).addNumberOption(option => option.setName("number").setDescription("number")),
new SlashCommandBuilder().setName("remove").setDescription("remove some amount from a player's lb score").addUserOption(option => option.setName("user").setDescription("user to remove score from")).addNumberOption(option => option.setName("number").setDescription("number")),
new SlashCommandBuilder().setName("say").setDescription("say something thru bot").addStringOption(option => option.setName("say").setDescription("user to remove score from").setRequired(true)).addChannelOption(option => option.setName("channel").setDescription("channel").setRequired(true))
];

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

        	const data2 = await rest.put(
			Routes.applicationGuildCommands(clientId, "516977525906341928"),
			{ body: commands },
		);

		const data3 = await rest.put(
			Routes.applicationGuildCommands(clientId, "1001847734766145607"),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length}, ${data2.length} and ${data3.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
