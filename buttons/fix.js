const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  name: 'fix',
  run: async (client, interaction, parms, {MusicDB}) => {
    let player = await client.manager.get(interaction.guildId);
    if(!interaction.member.permissions.has('ADMINISTRATOR')) return interaction.reply({content: `You dont have permission to do that`}).catch(err => {client.error(err)});
    if(player) player.destroy();

    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('pause')
        .setLabel('โธ๏ธ Pause')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('skip')
        .setLabel('โญ๏ธ Skip')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('loop')
        .setLabel('๐ Loop')
        .setStyle('DANGER'),
      new MessageButton()
        .setCustomId('stop')
        .setLabel('โน๏ธ Stop')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('fix')
        .setLabel('โ๏ธ Repair')
        .setStyle('SECONDARY'),
    ]);

    const row1 = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId('summon')
        .setLabel('โก Summon')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('queuelist')
        .setLabel('๐งพ Queue List')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('clear')
        .setLabel('๐๏ธ Clear')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('grab')
        .setLabel('๐ฃ Grab')
        .setStyle('SECONDARY'),
      new MessageButton()
        .setCustomId('stats')
        .setLabel('๐พ Stats')
        .setStyle('SECONDARY'),
    ]);

    const embed = {
      title: `๐ต Vibing Music ๐ต`,
      description: `Few permission have been changed to bot. So kindly please re-invite the awesome bot with new link. Many Thanx \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
      color: 0xd43790,
      image: {
        url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
      },
      thumbnail: {
        url: '',
      },
      footer: {
        text: `${client.user.username} Music`,
        iconURL: `${client.user.avatarURL()}`,
      },
    };
    client.musicMessage[interaction.guildId] = await interaction.channel.messages.fetch(MusicDB.musicMessageId);
    client.musicMessage[interaction.guildId].edit({content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed], components: [row, row1]});
    return interaction.reply({content: `fixed`}).catch(err => {client.error(err)});
  }
}
