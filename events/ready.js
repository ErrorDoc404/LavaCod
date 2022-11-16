/**
 *
 * @param {import("../library/DiscordActivityBot ")} client
 */
 module.exports = async (client) => {
    (client.Ready = true),
    client.user.setPresence(client.config.presence);
    client.log("Successfully Logged in as " + client.user.tag);
    client.manager.init(client.user.id);
    client.RegisterSlashCommands();
    client.guilds.cache.forEach((data) => {
      client.skipSong[data.id] = false;
      client.skipBy[data.id] = false;
    });
  };
