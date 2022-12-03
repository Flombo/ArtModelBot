"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_2.GatewayIntentBits.Guilds] });
client.on('ready', () => {
    console.log('bot has login');
});
client.login(process.env.BOTTOKEN).then(r => console.log(r));
