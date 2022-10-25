const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'grab',
  run: async (client, interaction, parms) => {
    return interaction.reply({content: `🎣 | Grab Will be in next Patch`}).catch(err => {client.error(err)});
  }
}
