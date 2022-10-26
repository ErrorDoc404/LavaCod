const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'clear',
  run: async (client, interaction, parms, {MusicDB}) => {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    let player = await client.manager.get(interaction.guildId);
    if(!player) return interaction.reply({content: `❌ | **Nothing in queue to skip**`}).catch(err => {client.error(err)});
    if (!player.queue || !player.queue.length || player.queue.length === 0) {
			return interaction.reply({ content: "❌ | **Invalid, Not enough track to be cleared.**", ephemeral: true }).catch(err => {client.error(err)});
		}

    player.queue.clear();

    let content;
    const musicMsg = client.musicMessage[interaction.guildId];
    content = `**[ Now Playing ]**\n${player.queue.current.title}.`;
    musicMsg.edit({content: content});

    return interaction.reply({ content: "✅ | **Cleared the queue!**" }).catch(err => {client.error(err)});
  }
}
