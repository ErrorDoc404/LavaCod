const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'queuelist',
  run: async (client, interaction, parms) => {
    return interaction.reply({content: `📃 | Queue List Will be in next Patch`}).catch(err => {client.error(err)});
  }
}
