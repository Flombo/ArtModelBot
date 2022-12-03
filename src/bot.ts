import {MessageEventHandler} from "./eventHandler/MessageEventHandler";

require('dotenv').config();

import {Client, Message} from "discord.js";
import { GatewayIntentBits } from "discord.js";

const client : Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', (message : Message) => MessageEventHandler.onMessageCreated(message));

client.login(process.env.BOTTOKEN).then(() => console.log('Bot logged in!'));