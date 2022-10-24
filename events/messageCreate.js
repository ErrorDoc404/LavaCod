module.exports = async (client, message) => {
  let MusicDB = await client.GetMusic(message.guild.id);
  if(!MusicDB) return;
  if(!MusicDB.musicChannelId) return;
  if(message.channel.id == MusicDB.musicChannelId){
    if(message.author.bot) {
      setTimeout(() => message.delete(), 3000);
    } else {
      message.delete();
      const play = client.Commands.get('play');
      play.run(client, message, {MusicDB});
    }
    // const msg = await message.channel.messages.fetch(MusicDB.musicMessageId);
  }
};
