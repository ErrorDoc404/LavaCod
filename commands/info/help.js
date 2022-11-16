const { Message, MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");

module.exports = {
    name: "help",
    description: "Information about the bot",
    usage: "[command]",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["command", "commands", "cmd"],
    category: "info",
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    SlashCommand: {
        options: [
            {
                name: "command",
                description: "Get information on a specific command",
                value: "command",
                type: 3,
                required: false,
            },
            {
                name: "category",
                description: "Get information on a specific Category",
                value: "category",
                type: 3,
                required: false,
                choices: [
                    {
                        name: 'Info',
                        value: 'info',
                    },
                    {
                        name: 'Music',
                        value: 'music',
                    }
                ],
            }
        ],
        /**
         *
         * @param {import("../structures/DiscordMusicBot")} client
         * @param {import("discord.js").Message} message
         * @param {string[]} args
         * @param {*} param3
         */
        run: async (client, interaction, args, { GuildDB }) => {
            if (!args) {
                return interaction.reply(`Select either category or commnad`).catch((err) => { client.error(err) });
            } else if (args.name == 'category') {
                const embed = new MessageEmbed();
                const cat = args.value;
                const commands = client.Commands;
                console.log(client.Commands);
                const catCommands = [];
                commands.forEach((cmd) => {
                    if (cmd.category != cat) return;
                    catCommands.push(cmd);
                });
                embed.setTitle(`Commands for ${args.value} category`);
                catCommands.forEach((catCmd) => {
                    embed.addFields({ name: `/${catCmd.name}`, value: `\`${catCmd.description}\``, inline: true });
                });
                return interaction.reply({ embeds: [embed] }).catch((err) => { client.error(err) });
            } else if (args.name == 'command') {
                let cmd = client.Commands.get(args.value) || client.Commands.find((x) => x.aliases && x.aliases.includes(args.value));

                if (!cmd) {
                    let notFound = new MessageEmbed();
                    notFound.setColor(`RED`);
                    notFound.setDescription(`❌ | Unable to find that command.`);

                    return interaction.reply({ embeds: [notFound] }).catch((err) => { client.error(err) });
                };

                let embed = new MessageEmbed()
                    .setTitle(`Command: ${cmd.name}`)
                    .setDescription(cmd.description)
                    .setColor("GREEN")
                    .addField("Name", cmd.name, true)
                    .addField(
                        "Usage",
                        `\`${GuildDB ? GuildDB.prefix : client.config.DefaultPrefix}${cmd.name
                        }${cmd.usage ? " " + cmd.usage : ""}\``,
                        true
                    )
                    .addField(
                        "Permissions",
                        "Member: " +
                        cmd.permissions.member.join(", ") +
                        "\nBot: " +
                        cmd.permissions.channel.join(", "),
                        true
                    );

                return interaction.reply({ embeds: [embed] }).catch((err) => { client.error(err) });
            }
        }
    }
};