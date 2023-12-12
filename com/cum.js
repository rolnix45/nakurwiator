const { SlashCommandBuilder } = require("@discordjs/builders");
const { QueryType } = require("discord-player");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("cum")
          .setDescription("puszcza sie")
          .addStringOption((option) => option
               .setName("co")
               .setDescription("link albo zapytanie na yt")
               .setRequired(true))
          .addStringOption((option) => option
               .setName("gdzie")
               .setDescription("wyszukuje na podanym serwisie")
               .setRequired(false)),
     run: async ({ client, interaction }) => {
          if (!interaction.member.voice.channel)
               return interaction.followUp("idoto, wejdz na kanal moze????? 🙄");
          let usr_input = interaction.options.getString("co");
          let gdzie = interaction.options.getString("gdzie");
          let embed;
          const result = await client.player.search(usr_input, {
               requestedBy: interaction.user,
               searchEngine: getSearchEngine(usr_input, gdzie)
          });
          if (result.tracks.length === 0)
               return interaction.followUp("chuj ci w dupe, nic nie znalazlem 😫");
          try {
               const { track } = await client.player.play(interaction.member.voice.channel, result, {
                    nodeOptions: { metadata: interaction }
               });
               console.log(`joined ${interaction.member.voice.channel.name}`);
               console.log(`requested ${track.title}; ${usr_input}`);
               embed = {
                    image: { url: track.thumbnail },
                    description: `puszczone tak jak twoja stara 🤡🤡\n **${track.title}**`,
                    footer: { text: `dlugosc: ${track.duration}` }
               };
          }
          catch (e) {
               console.log(`<cum.js> error ${e}`);
               return interaction.followUp(`💥 wyjbalo sie: ${e} 💥`);
          };
          await interaction.editReply({
               embeds: [embed]
          });
     }
};

const getSearchEngine = (usr_input, gdzie) => {
     if (isValidUrl(usr_input))
          return getSource(usr_input);
     else if (gdzie !== undefined && gdzie !== null) {
          switch (gdzie) {
               case "yt":
               case "youtube":
               case "y":
                    return QueryType.YOUTUBE_SEARCH;
               case "s":
               case "spotify":
                    return QueryType.SPOTIFY_SEARCH;
               case "sc":
               case "soundcloud":
                    return QueryType.SOUNDCLOUD_SEARCH;
               default:
                    return QueryType.YOUTUBE_SEARCH;
          };
     }
     else
          return QueryType.YOUTUBE_SEARCH;
};

const getSource = (string) => {
     const domain = (new URL(string)).hostname.replace("www.", "");
     switch (domain) {
          case "youtube.com":
               return QueryType.YOUTUBE_VIDEO;
          case "spotify.com":
               return QueryType.SPOTIFY_SONG;
          case "soundcloud.com":
               return QueryType.SOUNDCLOUD_TRACK;
          default:
               return;
     };
};

const isValidUrl = (string) => {
     try {
          new URL(string);
     }
     catch (_) {
          return false;
     };
     return true;
}; 

//isValidUrl(usr_input) ? getSource(usr_input) : 
//                    (gdzie === undefined ? QueryType.YOUTUBE_SEARCH : gdzie)