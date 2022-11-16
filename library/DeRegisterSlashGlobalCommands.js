const { Client } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/**
 * Register slash commands for a guild
 * @param {require("../structures/DiscordActivityBot")} client
 * @param {string} guild
 */

module.exports = (client) => {

     const rest = new REST({ version: '9' }).setToken(client.config.Token);

     (async () => {
         try {
             await rest.get(Routes.applicationCommands(client.config.Id))
                .then(data => {
                   const promises = [];
                   for (const command of data) {
                       const deleteUrl = `${Routes.applicationCommands(client.config.Id)}/${command.id}`;
                       promises.push(rest.delete(deleteUrl));
                   }
                   return Promise.all(promises);
               }).catch(err => {client.error(err)})
         } catch (error) {
             client.error(error);
         }
     })();
};
