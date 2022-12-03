import {CommandMessage} from "../models/CommandMessage";
import {Message} from "discord.js";

export class MessageEventHandler {

    public static onMessageCreated(message : Message) {
        const commandMessage = new CommandMessage(message);

        if(commandMessage.command === null || commandMessage.command === undefined) return;

        if(commandMessage.command === 'pose') {
            message.channel.send('Retrieving reference pose....');
        }
    }

}