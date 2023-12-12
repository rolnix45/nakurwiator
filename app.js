const Discord = require('discord.js');
const dotenv = require('dotenv');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const { Player } = require('discord-player');
const { EOF } = require('dns');

dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const LOAD_CMDS = process.argv[2] == 'load';

const client = new Discord.Client({
     intents: [
          Discord.GatewayIntentBits.Guilds,
          Discord.GatewayIntentBits.GuildVoiceStates
     ],
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
     ytdlOptions: {
          quality: "lowestaudio",
          highWaterMark: 1 << 25
     }
});
client.player.extractors.loadDefault();

let commands = [];
const cmd_files = fs.readdirSync('./com').filter(file => file.endsWith('.js'));
for (const file of cmd_files) {
     const command = require(`./com/${file}`);
     client.slashcommands.set(command.data.name, command);
     if (LOAD_CMDS) {
          commands.push(command.data.toJSON());
     };
};

if (LOAD_CMDS) {
     const rest = new REST({ version: '9' }).setToken(TOKEN);
     console.log("deploying commands");
     rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands })
          .then(() => {
               console.log('success');
               process.exit(0);
          })
          .catch((err) => {
               console.error(err);
               process.exit(-1);
          });
}
else {
     client.on('ready', () => {
          console.log(`logged in as ${client.user.tag}`);
     });
     client.on('interactionCreate', (interaction) => {
          async function handleCommand() {
               if (!interaction.isCommand()) return;
               const cmd = client.slashcommands.get(interaction.commandName);
               if (!cmd) interaction.reply('zla komenda cwelu');
               await interaction.deferReply();
               await cmd.run({ client, interaction });
          };
          handleCommand();
     });
     client.on("playerError", (e) => {
          console.error(`<app.js> player error: ${e}`);
          client.channels.cache.get("1182423332365287504").send(`wyjebalo TRAGICZNY blad: ${e}`)
     });
     client.login(TOKEN);
};