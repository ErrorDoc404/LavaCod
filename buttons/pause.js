const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: 'pause',
  run: async (client, interaction, parms) => {
    const player = await client.manager.get(interaction.guildId);
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.member.user.id);
    if (!player) return interaction.reply({content: `❌ | **Nothing is playing right now...**`}).catch(err => {client.error(err)});
    if (!member.voice.channel) return interaction.reply({content: `❌ | **You must be in a voice channel to use this Button!**`}).catch(err => {client.error(err)});
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return interaction.reply({content: `❌ | **You must be in the same voice channel as me to use this Button!**`}).catch(err => {client.error(err)});
    if (player.paused) return interaction.reply({content: `❌ | **Music is already paused!**`}).catch(err => {client.error(err)});
    player.pause(true);

    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('play')
        .setLabel('▶️ Play')
        .setStyle('SUCCESS'),
      new MessageButton()
        .setCustomId('skip')
        .setLabel('⏭️ Skip')
        .setStyle('SECONDARY'),
      // new MessageButton()
      //   .setCustomId('loop')
      //   .setLabel('🔁 Loop')
      //   .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('stop')
        .setLabel('⏹️ Stop')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('fix')
        .setLabel('⚒️ Repair')
        .setStyle('SECONDARY'),
    ]);

    // const row1 = new MessageActionRow().addComponents([
    //   new MessageButton()
    //     .setCustomId('minvolume')
    //     .setLabel('🔈 Vol -')
    //     .setStyle('SECONDARY'),
    //   new MessageButton()
    //     .setCustomId('addvolume')
    //     .setLabel('🔊 Vol +')
    //     .setStyle('SECONDARY'),
    //   new MessageButton()
    //     .setCustomId('clear')
    //     .setLabel('🗑️ Clear')
    //     .setStyle('SECONDARY'),
    //   new MessageButton()
    //     .setCustomId('grab')
    //     .setLabel('🎣 Grab')
    //     .setStyle('SECONDARY'),
    //   new MessageButton()
    //     .setCustomId('track')
    //     .setLabel('⏭️ Track')
    //     .setStyle('SECONDARY'),
    // ]);

    client.musicMessage[interaction.guildId].edit({components: [row]});
    return interaction.reply({content: `✅ | Music Paused`}).catch(err => {client.error(err)});
  }
}
