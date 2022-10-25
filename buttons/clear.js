const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'clear',
  run: async (client, interaction, parms) => {
    return interaction.reply({content: `🗑️ | Clear Will be in next Patch`}).catch(err => {client.error(err)});
  }
}
