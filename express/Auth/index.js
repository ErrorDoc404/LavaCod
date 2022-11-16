require('dotenv').config();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../../mongoose/database/schemas/User');
const scopes = ['identify', 'email', 'guilds', 'guilds.join'];

passport.serializeUser((user, done) => {
  done(null, user.discordId)
});

passport.deserializeUser(async (discordId, done) => {
  try{
    const user = await User.findOne({discordId});
    return user ? done(null, user) : done(null, null);
  } catch (err) {
    console.log(err);
    return done(err, null);
  }
});

passport.use(new DiscordStrategy({
    clientID: process.env.Discord_ClientID ,
    clientSecret: process.env.Discord_ClientSecret,
    callbackURL: process.env.CALLBACK_URL,
    scope: scopes
}, async function(accessToken, refreshToken, profile, done) {
      const {id, email, username, discriminator, avatar, guilds} = profile;
      try{
        const findUser = await User.findOneAndUpdate({discordId: id }, {
          discordTag: `${username}#${discriminator}`,
          avatar,
          guilds,
          email,
        }, {new: true});
        if(findUser){
          console.log('user found');
          return done(null, findUser);
        } else {
          const newUser = await User.create({
            discordId: id,
            discordTag: `${username}#${discriminator}`,
            avatar,
            guilds,
            email,
          });
          return done(null, newUser);
        }
      }catch (err){
        console.log(err);
        return done(err, null);
      }
  })

);