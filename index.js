const DiscordActivityBot = require('./library/DiscordActivityBot');

const client = new DiscordActivityBot();

client.build(client.config.buildToken);

module.exports = client;
