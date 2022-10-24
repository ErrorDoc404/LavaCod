const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const Logger = require("./Logger");
const logger = new Logger();
const ConfigFetcher = require('../config');

class DiscordMusicBot extends Client{

    constructor(props = {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
        ],
    }){
        super(props);

        this.config = ConfigFetcher;
        
        this.musicMessage = [];

        this.skipSong = [];
        this.skipBy = [];

        this.SlashCommands = new Collection();
        this.Commands = new Collection();
        this.CommandsRan = 0;
        this.Buttons = new Collection();


        // this.LoadButtons();

        this.LoadEvents();
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

    build(){
        this.warn('Server is starting');
        this.login(this.config.Token);

        // this.MongooseConnect();
    }

}

module.exports = DiscordMusicBot;