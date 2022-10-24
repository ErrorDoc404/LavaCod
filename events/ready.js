/**
 *
 * @param {import("../library/DiscordMusicBot")} client
 */
 module.exports = async (client) => {
    (client.Ready = true),
    client.user.setPresence({ activities: [{ name: `discord.js v14`, type: `WATCHING` }], status: 'dnd' });
    client.log("Successfully Logged in as " + client.user.tag);
    // client.manager.init(client.user.id);
    // client.RegisterSlashCommands();
    // client.guilds.cache.forEach((data) => {
    //   client.skipSong[data.id] = false;
    //   client.skipBy[data.id] = false;
    // });
  };