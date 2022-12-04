"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MessageEventHandler_1 = require("./eventHandler/MessageEventHandler");
require('dotenv').config();
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_2.GatewayIntentBits.Guilds, discord_js_2.GatewayIntentBits.GuildMessages, discord_js_2.GatewayIntentBits.MessageContent] });
const imessageEventHandler = new MessageEventHandler_1.MessageEventHandler();
client.on('messageCreate', (message) => imessageEventHandler.onMessageCreated(message));
client.login(process.env.BOTTOKEN).then(() => console.log('Bot logged in!'));
//# sourceMappingURL=bot.js.map