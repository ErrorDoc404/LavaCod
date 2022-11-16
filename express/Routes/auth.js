const client = require("../../");
const api = require("express").Router();

api.get('/', async (req, res ) => {
    if(req.user)
        return res.send(req.user);
    else return res.send(false);
});

api.get('/guilds', async (req, res ) => {
    if(req.user)
        return res.send(req.user.guilds);
    else return res.send(false);
});

module.exports = api;