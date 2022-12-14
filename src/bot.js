"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PoseMessageEventHandler_1 = require("./eventHandler/PoseMessageEventHandler");
require('dotenv').config();
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
const client = new discord_js_1.Client({ intents: [discord_js_2.GatewayIntentBits.Guilds, discord_js_2.GatewayIntentBits.GuildMessages, discord_js_2.GatewayIntentBits.MessageContent] });
const imessageEventHandler = new PoseMessageEventHandler_1.PoseMessageEventHandler();
client.on('messageCreate', (message) => imessageEventHandler.onMessageCreated(message));
client.on('interactionCreate', (buttonInteraction) => imessageEventHandler.onButtonClicked(buttonInteraction));
client.login(process.env.BOTTOKEN).then(() => console.log('Bot logged in!'));
//# sourceMappingURL=bot.js.map