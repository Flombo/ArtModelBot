import {ButtonInteraction, Message} from "discord.js";

export interface IMessageEventHandler {

    /**
     * Checks sent message and displays the retrieved reference.
     * If an exception occurs during retrieval an error message will be displayed.
     * If the user entered a wrong command, an error / help message will be displayed
     * @param message
     */
    onMessageCreated(message : Message) : void;

    /**
     *
     * @param buttonInteraction
     */
    onButtonClicked(buttonInteraction : ButtonInteraction) : Promise<void>;
}