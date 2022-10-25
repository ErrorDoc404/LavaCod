const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'summon',
  run: async (client, interaction, parms) => {
    console.log(interaction.guild.id);
    const player = await client.manager.create({
        guild: interaction.guild.id,
        voiceChannel: interaction.member.voice.channel.id,
        selfDeafen: true, 
    });
    if (player.state != "CONNECTED") await player.connect();

    return interaction.reply({content: `⚡ | Summoned in your voice channel`}).catch(err => {client.error(err)});
  }
}
