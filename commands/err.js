const { SlashCommandBuilder } = require("discord.js");

module.exports = {
     data: new SlashCommandBuilder()
          .setName("err")
          .setDescription("crash test"),
     run: async ({ client: _, interaction }) => {
          try {
               throw { 
                    name:        "CRASH_TEST", 
                    level:       "Show Stopper", 
                    message:     "wyjebal to ci stary lute 💫", 
                    toString:    function() { return this.name + ": " + this.message; } 
               };
          }
          catch (e) {
               console.error(`<err.js> error: ${e}`);
               return interaction.followUp(`💥 wyjebalo sie: ${e} 💥`);
          };
     }
};