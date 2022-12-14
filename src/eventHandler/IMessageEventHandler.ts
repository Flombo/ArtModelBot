import {ButtonInteraction, Message} from "discord.js";

export interface IMessageEventHandler {
    onMessageCreated(message : Message) : void;
    onButtonClicked(buttonInteraction : ButtonInteraction) : void;
}