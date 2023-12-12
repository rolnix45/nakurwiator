const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("kutas")
          .setDescription("nara"),
     run: async ({ client: _, interaction }) => {
          try {
               const con = getVoiceConnection(interaction.guild.id);
               if (con === undefined) {
                    await interaction.followUp("nie ma mnie na kanale!!!!!!!");
                    return;
               };
               useQueue(interaction.guild.id).node.stop();
               con.destroy();
               return interaction.followUp("⏹ **nara** ⏹");
          }
          catch (e) {
               console.error(`<kutas.js> error: ${e}`);
               return interaction.followUp(`💥 wyjebalo sie: ${e} 💥`)
          };
     }
};