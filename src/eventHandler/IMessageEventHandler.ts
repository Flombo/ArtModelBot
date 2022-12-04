import {Message} from "discord.js";

export interface IMessageEventHandler {
    onMessageCreated(message : Message) : void;
}