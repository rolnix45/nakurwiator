const { SlashCommandBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("sperma")
          .setDescription("pauza i nie"),
     run: async ({ client: _, interaction }) => {
          const queue = useQueue(interaction.guild.id);
          try {
               queue.node.setPaused(!queue.node.isPaused());
               return interaction.followUp(queue.node.isPaused() ? "⏸ **STOP** ⏸" : "▶ **leci dalej** ▶");
          }
          catch (e) {
               console.error(`<sperma.js> error ${e}`);
               return interaction.followUp(`💥 wyjebalo sie lol: ${e} 💥`);
          };
     }
};