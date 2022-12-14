require('dotenv').config();

module.exports = {
    Id: process.env.Discord_ClientID,
    prefix: process.env.PREFIX || '!',
    Admins: ["UserID", "UserID"],
    buildToken: process.env.BUILD_TOKEN || 'build token',
    Token: process.env.TOKEN || 'bot token',

    presence: {
        status: "active", // online, idle, and dnd(invisible too but it make people think the bot is offline)
        activities: [
            {
              name: "Music", //Status Text
              type: "LISTENING", // PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },

    // lavalink server
    lavalink: {
      id: "KartaDharta",
      host: '140.238.226.251',
      port: 3000,
      password: 'lavaserver',
      secure: false,
    },

    Spotify: {
      ClientID: process.env.Spotify_ClientID || "", //Spotify Client ID
      ClientSecret: process.env.Spotify_ClientSecret || "", //Spotify Client Secret
    },
    retryDelay: 200,
    retryAmount: 40,

    mongooseURL: process.env.MONGOOSE_URL || "",
};
