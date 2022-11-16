const { Server } = require("socket.io");
const client = require("../../index");
const Client = require("../index");
const botName = 'kartadharta';

/**
 * @param {Server} io
 */

module.exports = (io) => {
  io.on("connection", (socket) => {
    //Bot's Main Page
    socket.on("index", () => {
      if (socket.Index) clearInterval(socket.Index);
      socket.Index = setInterval(() => {
        const Client = require("../../index");
        if (!Client.Ready) return;
        Client.InQueue = 0;
        for (var key in Client.guildQueue) {
          Client.InQueue = Client.InQueue + Client.guildQueue[key];
        }
        socket.emit("index", {
          commands: Client.CommandsRan,
          playMusic: Client.MusicPlayed,
          inQueue: Client.InQueue,
          guilds: Client.guilds.cache.size,
          ping: Client.ws.ping,
        });
      }, 1000);
    });

  });
};
