const { SlashCommandBuilder } = require('@discordjs/builders');
const { useQueue } = require("discord-player")

module.exports = {
     data: new SlashCommandBuilder()
          .setName('seks')
          .setDescription("chuj w dupie chlupie"),
     run: async ({ client: _, interaction }) => {
          const queue = useQueue(interaction.guild.id);
          try {
               queue.node.skip();
               if (queue.isEmpty) 
                    return interaction.followUp("❌ **KONIEC!!!** ❌");
               return interaction.followUp("⏭ **next nuta** ⏭");
          }
          catch (e) {
               console.error(`<seks.js> error ${e}`);
               return interaction.followUp(`💥 wyjbalo sie: ${e} 💥`);
          }
     },
};