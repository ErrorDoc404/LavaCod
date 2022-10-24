const GuildConfig = require("../mongoose/database/schemas/GuildConfig");

module.exports = async (client, guild) => {

  try{
    const findGuildConfig = await GuildConfig.findOne({guildId: guild.id });
    if(findGuildConfig){
      console.log('Guild found');
    } else {
      const newGuildConfig = await GuildConfig.create({
        guildId: guild.id,
        prefix: '!',
      });
    }
  }catch (err){
    console.log(err);
  }
};
