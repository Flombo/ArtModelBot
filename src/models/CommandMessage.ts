import {Message} from "discord.js";

/**
 * Representation of a command object that is used by {@link MessageEventHandler}
 */
export class CommandMessage {
    private _command : string;
    private _options : Array<string>;

    constructor(message : Message) {
        const messageContent : string = message.content;
        if (!messageContent.startsWith('!')) return;
        this.setAttributesFromMessageContent(messageContent);
    }

    get command(): string {
        return this._command;
    }

    get options(): Array<string> {
        return this._options;
    }

    /**
     *  Sets the command and options attributes from message-content.
     * @param messageContent
     * @private
     */
    private setAttributesFromMessageContent(messageContent : string) : void {
        const splitCommandParts : string[] = messageContent.split(' ');
        this._command = splitCommandParts[0].split('!')[1];

        if(splitCommandParts.length > 1) {
            this._options = splitCommandParts.filter(
                (splitCommandPart) => {
                    return splitCommandPart !== splitCommandParts[0]
                });
        }
    }
}