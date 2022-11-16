const { Client } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/**
 * Register slash commands for a guild
 * @param {require("../structures/DiscordActivityBot")} client
 * @param {string} guild
 */

module.exports = (client, guild) => {

     const rest = new REST({ version: '9' }).setToken(client.config.Token);

     (async () => {
         try {
             client.warn(`deleting ${guild} registed commands`);
             await rest.get(Routes.applicationGuildCommands(client.config.Id, guild))
                .then(data => {
                   const promises = [];
                   for (const command of data) {
                       const deleteUrl = `${Routes.applicationGuildCommands(client.config.Id, guild)}/${command.id}`;
                       promises.push(rest.delete(deleteUrl));
                   }
                   return Promise.all(promises);
               }).catch(err => {client.error(err)})
         } catch (error) {
             client.error(error);
         }
     })();
};
