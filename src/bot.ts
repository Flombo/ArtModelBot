import {PoseMessageEventHandler} from "./eventHandler/PoseMessageEventHandler";
import {config} from "dotenv";
import {ButtonInteraction, Client, Message} from "discord.js";
import { GatewayIntentBits } from "discord.js";
import {IMessageEventHandler} from "./eventHandler/IMessageEventHandler";

config();

const client : Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const imessageEventHandler : IMessageEventHandler = new PoseMessageEventHandler();

client.on('messageCreate', (message : Message) => imessageEventHandler.onMessageCreated(message));
client.on('interactionCreate', (buttonInteraction : ButtonInteraction) => imessageEventHandler.onButtonClicked(buttonInteraction));

client.login(process.env.BOTTOKEN).then(() => console.log('Bot logged in!'));