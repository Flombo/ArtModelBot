"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEventHandler = void 0;
const CommandMessage_1 = require("../models/CommandMessage");
class MessageEventHandler {
    static onMessageCreated(message) {
        const commandMessage = new CommandMessage_1.CommandMessage(message);
        if (commandMessage.command === null || commandMessage.command === undefined)
            return;
        if (commandMessage.command === 'pose') {
            message.channel.send('Retrieving reference pose....');
        }
    }
}
exports.MessageEventHandler = MessageEventHandler;
//# sourceMappingURL=MessageEventHandler.js.map