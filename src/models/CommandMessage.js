"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandMessage = void 0;
/**
 * Representation of a command object that is used by {@link MessageEventHandler}
 */
class CommandMessage {
    constructor(message) {
        const messageContent = message.content;
        if (!messageContent.startsWith('!'))
            return;
        this.setAttributesFromMessageContent(messageContent);
    }
    get command() {
        return this._command;
    }
    get options() {
        return this._options;
    }
    /**
     *  Sets the command and options attributes from message-content.
     * @param messageContent
     * @private
     */
    setAttributesFromMessageContent(messageContent) {
        const splitCommandParts = messageContent.split(' ');
        this._command = splitCommandParts[0].split('!')[1];
        if (splitCommandParts.length > 1) {
            this._options = splitCommandParts.filter((splitCommandPart) => {
                return splitCommandPart !== splitCommandParts[0];
            });
        }
    }
}
exports.CommandMessage = CommandMessage;
//# sourceMappingURL=CommandMessage.js.map