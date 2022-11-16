const api = require("express").Router();
const { Collection } = require("discord.js");
const { join } = require("path");
const config = require("../config");
const Auth = require("./Middlewares/Auth");
const fs = require("fs");

const categories = fs.readdirSync(__dirname + '/../commands/');
let Commands = [];

categories.filter((cat) => !cat.endsWith('.js')).forEach((cat) => {
  const files = fs.readdirSync(__dirname + `/../commands/${cat}/`).filter((f) =>
    f.endsWith('.js')
  );
  files.forEach((file) => {
    let cmd = require(__dirname + `/../commands/${cat}/` + file);
    if (!cmd.name || !cmd.description || !cmd.SlashCommand) return;
    Commands.push({
      name: cmd.name,
      aliases: cmd.aliases,
      usage: cmd.usage,
      description: cmd.description,
      slash: cmd.SlashCommand ? true : false,
    });
  })
});

Commands.sort(function (cmd1, cmd2) {
  if (cmd1.name > cmd2.name) return 1;
  if (cmd1.name < cmd2.name) return -1;
  return 0;
});


api.get("/", (req, res) => {
  res.sendFile(join(__dirname, "..", "webview", "index.html"));
});

// api.get("/dashboard", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "webview", "dashboard.html"));
// });

// api.get("/passbook", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "webview", "passbook.html"));
// });

// api.get("/chat", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "webview", "chat.html"));
// });

// api.get("/servers", Auth, (req, res) => {
//   res.sendFile(join(__dirname, "..", "views", "servers.html"));
// });

// api.get("/server/:id", Auth, (req, res) => {
//   if (!req.user.guilds.find((x) => x.id == req.params.id))
//     return res.redirect("/servers");
//   res.sendFile(join(__dirname, "..", "views", "server.html"));
// });

// api.get("/server/:id/music", Auth, (req, res) => {
//   if (!req.user.guilds.find((x) => x.id == req.params.id))
//     return res.redirect("/servers");
//   res.sendFile(join(__dirname, "..", "views", "music.html"));
// });

// api.get("/api/info", (req, res) => {
//   res.send({
//     ClientID: config.ClientID,
//     Permissions: config.Permissions,
//     Scopes: config.Scopes,
//     Website: config.Website,
//     CallbackURL: config.CallbackURL,
//   });
// });

api.get("/api/commands", (req, res) => {
  res.send({ commands: Commands });
});

api.get("/logout", (req, res) => {
  if (req.user) req.logout();
  res.redirect("/");
});

module.exports = api;