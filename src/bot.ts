import {MessageEventHandler} from "./eventHandler/MessageEventHandler";

require('dotenv').config();

import {Client, Message} from "discord.js";
import { GatewayIntentBits } from "discord.js";
import {IMessageEventHandler} from "./eventHandler/IMessageEventHandler";

const client : Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const imessageEventHandler : IMessageEventHandler = new MessageEventHandler();

client.on('messageCreate', (message : Message) => imessageEventHandler.onMessageCreated(message));

client.login(process.env.BOTTOKEN).then(() => console.log('Bot logged in!'));