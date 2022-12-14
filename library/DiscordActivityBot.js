const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const Logger = require("./Logger");
const logger = new Logger();
const ConfigFetcher = require('../config');
const fs = require('fs');
const mongoose = require('mongoose');
const GuildConfig = require("../mongoose/database/schemas/GuildConfig");
const play = require('../music/play.js');
const { Manager } = require("erela.js");
const Spotify = require("better-erela.js-spotify").default;
const { default: AppleMusic } = require("better-erela.js-apple");
const deezer = require("erela.js-deezer");
const facebook = require("erela.js-facebook");

class DiscordActivityBot extends Client {

  constructor(props = {intents: [32767]}){
      super(props);

      this.config = ConfigFetcher;

      this.musicMessage = [];

      this.skipSong = [];
      this.skipBy = [];

      this.SlashCommands = new Collection();
      this.Commands = new Collection();
      this.CommandsRan = 0;
      this.Buttons = new Collection();

      this.LoadEvents();
      this.LoadButtons();

      this.Commands.set('play', play);

      var client = this;

      // Initiate the Manager with some options and listen to some events.
      this.manager = new Manager({
        autoPlay: true,
        // plugins
        plugins: [
          new deezer(),
          new AppleMusic(),
          new Spotify(),
          new facebook(),
        ],
        autoPlay: true,
        retryDelay: this.config.retryDelay,
        retryAmount: this.config.retryAmount,
        // Pass an array of node.
        nodes: [this.config.lavalink],
        // A send method to send data to the Discord WebSocket using your library.
        // Getting the shard for the guild and sending the data to the WebSocket.
        send(id, payload) {
          const guild = client.guilds.cache.get(id);
          if (guild) guild.shard.send(payload);
        }
      }).on("nodeConnect", node => logger.commands(`Node ${node.options.identifier} connected`))
        .on("nodeError", (node, error) => logger.error(`Node ${node.options.identifier} had an error: ${error.message}`))
        .on("trackStart", (player, track) => {
          let content;
          const musicMsg = client.musicMessage[player.guild];
          if(player.queue.length == 0)
            content = `**[ Now Playing ]**\n${track.title}.`;
          else {
            content = `\n**[ Now Playing ]**\n${track.title}.\n**[ ${player.queue.length} Songs in Queue ]**`;
            musicMsg.edit({content: content});
          };
          this.playSong(track.title,player.queue.length);
          const musicEmbed = musicMsg.embeds[0];
          const thumbnail = track.thumbnail ? track.thumbnail.replace('default', 'hqdefault') : 'https://c.tenor.com/eDVrPUBkx7AAAAAd/anime-sleepy.gif';
          const msgEmbed = {
              title: track.title,
              color: 0xd43790,
              image: {
                url: thumbnail,
              },
              thumbnail: {
                url: track.thumbnail,
              },
              footer: {
                text: `???? Volume: ${player.volume}`,
                 iconURL: `${client.user.avatarURL()}`,
             },
            };
          const playEmbed = new MessageEmbed(msgEmbed);
          playEmbed.addField(`Requested By`, `${track.requester.username}`, true);
          if(client.skipSong[player.guild] && client.skipBy[player.guild]) {
            playEmbed.addField(`Skip By`, `${client.skipBy[player.guild].username}`, true);
            client.skipSong[player.guild] = false;
            client.skipBy[player.guild] = false;
          }
          musicMsg.edit({content: content, embeds: [playEmbed]});
        })
        .on("queueEnd", (player) => {
          const musicMsg = client.musicMessage[player.guild];
          client.skipSong[player.guild] = false;
          client.skipBy[player.guild] = false;
          let description = null;
          const embed = {
            title: `???? Vibing Music ????`,
            description: `Few permission have been changed to bot. So kindly please re-invite the awesome bot with new link. Many Thanx \n\n [Invite Link](https://discord.com/oauth2/authorize?client_id=946749028312416327&permissions=277083450689&scope=bot%20applications.commands)`,
            color: 0xd43790,
            image: {
              url: 'https://i.pinimg.com/originals/55/28/82/552882e7f9e8ca8ae79a9cab1f6480d6.gif',
            },
            thumbnail: {
              url: '',
            },
            footer: {
              text: `${client.user.username} Music`,
              iconURL: `${client.user.avatarURL()}`,
            },
          };

          const row = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId('pause')
              .setLabel('?????? Pause')
              .setStyle('PRIMARY'),
            new MessageButton()
              .setCustomId('skip')
              .setLabel('?????? Skip')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('loop')
              .setLabel('???? Loop')
              .setStyle('DANGER'),
            new MessageButton()
              .setCustomId('stop')
              .setLabel('?????? Stop')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('fix')
              .setLabel('?????? Repair')
              .setStyle('SECONDARY'),
          ]);
      
          const row1 = new MessageActionRow().addComponents([
            new MessageButton()
              .setCustomId('summon')
              .setLabel('??? Summon')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('queuelist')
              .setLabel('???? Queue List')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('clear')
              .setLabel('??????? Clear')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('grab')
              .setLabel('???? Grab')
              .setStyle('SECONDARY'),
            new MessageButton()
              .setCustomId('stats')
              .setLabel('???? Stats')
              .setStyle('SECONDARY'),
          ]);

          musicMsg.edit({content: `**[ Nothing Playing ]**\nJoin a voice channel and queue songs by name or url in here.`, embeds: [embed], components: [row, row1]});

          player.destroy();
        });

  }

  log(Text){
      logger.log(Text);
  }

  warn(Text){
      logger.warn(Text);
  }

  error(Text){
      logger.error(Text);
  }

  playSong(song, queueLength){
    logger.playSong(song, queueLength);
  }

  LoadEvents(){
    fs.readdir('./events/', async (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`../events/${file}`);
        let evtName = file.split('.')[0];
        this.on(evtName, evt.bind(null, this));
        logger.events(`Loaded event '${evtName}'`);
      });
    });
  }

  LoadButtons(){
    fs.readdir('./buttons/', async (err, files) => {
      if (err) return console.error(err);
      files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const button = require(`../buttons/${file}`)
        let btnName = file.split('.')[0];
        this.Buttons.set(btnName, button);
        logger.log(`Loaded button '${btnName}'`);
      });
    });
  }

  build(token){
      this.warn('Server is starting');
      this.login(this.config.Token);

      this.MongooseConnect();
  }

  RegisterSlashCommands(){
    require("./SlashCommand")(this);
  }

  DeRegisterGlobalSlashCommands(){
    require("./DeRegisterSlashGlobalCommands")(this);
  }

  DeRegisterGuildSlashCommands(){
    this.guilds.cache.forEach((guild) => {
      require("./DeRegisterSlashGuildCommands")(this, guild.id);
    });
  }

  MongooseConnect(){
    mongoose.connect(this.config.mongooseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(data => {
      this.warn(`Connected to ${data.connection.host}:${data.connection.port} database: ${data.connection.name}`);
    })
    .catch(err => {this.warn(err)});
  }

  GetMusic(GuildID) {
    return new Promise(async (res, rej) => {
        const findGuildConfig = await GuildConfig.findOne({guildId: GuildID });
        res(findGuildConfig);
    });
  }
}

module.exports = DiscordActivityBot;
