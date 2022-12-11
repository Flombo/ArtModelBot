"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEventHandler = void 0;
const CommandMessage_1 = require("../models/CommandMessage");
const discord_js_1 = require("discord.js");
const PoseCommandValidator_1 = require("../validators/PoseCommandValidator");
const ReferenceRetriever_1 = require("../referenceRetriever/ReferenceRetriever");
class MessageEventHandler {
    constructor() {
        this.referenceRetriever = new ReferenceRetriever_1.ReferenceRetriever();
    }
    onMessageCreated(message) {
        const commandMessage = new CommandMessage_1.CommandMessage(message);
        const poseCommandValidator = new PoseCommandValidator_1.PoseCommandValidator();
        if (commandMessage.command === null || commandMessage.command === undefined)
            return;
        try {
            poseCommandValidator.isValid(commandMessage, message.content);
        }
        catch (error) {
            message.channel.send(error.message);
            return;
        }
        this.checkOptionsLength(commandMessage, message);
    }
    checkOptionsLength(commandMessage, message) {
        if (commandMessage.options.length === 1 && commandMessage.options[0].startsWith("h")) {
            this.sendHelpMessage(message);
        }
        else {
            message.channel.send("Retrieving reference image...");
            message.channel.sendTyping();
            this.sendReference(message, commandMessage);
        }
    }
    /**
     * Displays a reference for the entered command.
     * If something went wrong an error message will be displayed.
     * @param message
     * @param commandMessage
     * @private
     */
    sendReference(message, commandMessage) {
        const embedBuilder = new discord_js_1.EmbedBuilder();
        this.referenceRetriever.loadReference(commandMessage).then(reference => {
            try {
                embedBuilder.setColor(0x0099FF)
                    .setTitle('Reference pose')
                    .setDescription(`Reference pose found for: *${message.content}*`)
                    .addFields({ name: 'Reference image', value: reference.referenceImage }, { name: 'Reference source', value: 'https://quickposes.com' }, { name: 'Owner', value: reference.source })
                    .setImage(reference.referenceImage)
                    .setTimestamp();
                message.channel.send({ embeds: [embedBuilder] });
            }
            catch (e) {
                embedBuilder.setColor(discord_js_1.Colors.DarkRed)
                    .setTitle('Error while retrieving reference')
                    .setDescription(`Due to some errors no reference could retrieved for the command *${message.content}*`)
                    .setTimestamp();
            }
        });
    }
    sendHelpMessage(message) {
        const embedBuilder = new discord_js_1.EmbedBuilder();
        embedBuilder.setColor(0x0099FF)
            .setTitle('Pose commands')
            .setDescription('List of available pose commands')
            .addFields({
            name: 'Pose reference command',
            value: '!pose <type-option (pose, face, hands, animals, landscapes, urban)> <gender-option (all, female, male)> <clothing-option (all, nude&partiallynude, clothes&costumes)',
            inline: true
        }, { name: 'Pose help command', value: '!pose help' })
            .setTimestamp();
        message.channel.send({ embeds: [embedBuilder] });
    }
}
exports.MessageEventHandler = MessageEventHandler;
//# sourceMappingURL=MessageEventHandler.js.map