const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
     data: new SlashCommandBuilder()
          .setName("guwno")
          .setDescription("stare puszczanie sie")
          .addSubcommand((sub) =>
               sub
                    .setName('u')
                    .setDescription('daje nute z linku')
                    .addStringOption((option) => option.setName('url').setDescription('link').setRequired(true))
          )
          .addSubcommand((sub) =>
			sub
				.setName("p")
				.setDescription("cala plejliste wpierdala to kolejki")
				.addStringOption((option) => option.setName("url").setDescription("link").setRequired(true))
		)
		.addSubcommand((sub) =>
			sub
				.setName("s")
				.setDescription("szuka nuty na yt")
				.addStringOption((option) => option.setName("szukane").setDescription("szuka").setRequired(true))
		),
     run: async ({ client, interaction }) => {
          if (!interaction.member.voice.channel) return interaction.editReply("idoto, wejdz na kanal moze?????");
          let embed = new EmbedBuilder();
          if (interaction.options.getSubcommand() === "u") {
               let url = interaction.options.getString("url");
               const result = await client.player.search(url, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_VIDEO
               });
               if (result.tracks.length === 0) return interaction.editReply("chujowy link, nic nie znalazlem");
               try {
                    const { track } = await client.player.play(interaction.member.voice.channel, result, {
                         nodeOptions: {
                              metadata: interaction
                         }
                    });
                    console.log(`joined ${interaction.member.voice.channel.name}`)
                    console.log(`requested ${track.title}; ${url}`)
                    embed = {
                         image: { url: track.thumbnail },
                         description: `puszczone tak jak twoja stara:\n **${track.title}**`,
                         footer: { text: `dlugosc: ${track.duration}` }
                    };
               }
               catch (e) {
                    console.log(`<cum.js> error ${e}`);
                    return interaction.followUp(`💥 wyjbalo sie: ${e} 💥`);
               };
          }
          else if (interaction.options.getSubcommand() === 'p') {
               return interaction.followUp("pierdol sie 💦");
          }
          else if (interaction.options.getSubcommand() === 's') {
               let query = interaction.options.getString("szukane");
               const result = await client.player.search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE_SEARCH
               });
               if (result.tracks.length === 0) return interaction.editReply("nic nie znalazlem, chujnia");
               try {
                    const { track } = await client.player.play(interaction.member.voice.channel, result, {
                         nodeOptions: {
                              metadata: interaction
                         }
                    });
                    console.log(`joined ${interaction.member.voice.channel.name}`)
                    console.log(`requested ${track.title}; ${query}`)
                    embed = {
                         image: { url: track.thumbnail },
                         description: `puszczone tak jak twoja stara ☢☢\n **${track.title}**`,
                         footer: { text: `dlugosc: ${track.duration}` }
                    }
               }
               catch (e) {
                    console.error(`<cum.js> error ${e}`)
                    return interaction.followUp(`💥 wyjbalo sie: ${e} 💥`);
               };
          }
          await interaction.editReply({
               embeds: [embed]
          });
     },
};