/**
 *
 * @param {import("../library/DiscordActivityBot ")} client
 */
 module.exports = async (client, data) => {
   client.manager.updateVoiceState(data);
};
