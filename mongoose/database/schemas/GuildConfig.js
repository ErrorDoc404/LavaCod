const mongoose = require('mongoose');

const GuildConfigSchema = new mongoose.Schema({
  guildId: {
    type: mongoose.SchemaTypes.String,
    require: true,
    unique: true,
  },
  prefix: {
    type: mongoose.SchemaTypes.String,
    require: true,
    default: '!',
  },
  musicChannelId: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
  musicMessageId: {
    type: mongoose.SchemaTypes.String,
    require: false,
    default: null,
  },
});

module.exports = mongoose.model('GuildConfig', GuildConfigSchema);
