const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'stats',
  run: async (client, interaction, parms) => {
    return interaction.reply({content: `👾 | Stats Will be in next Patch`}).catch(err => {client.error(err)});
  }
}
