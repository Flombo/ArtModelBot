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
        if (!poseCommandValidator.isValid(commandMessage)) {
            message.channel.send(`Oops: *'${message.content}'* isn't a valid pose command to retrieve the possible pose-commands enter: !pose help`);
            return;
        }
        this.checkOptionsLength(commandMessage, message);
    }
    checkOptionsLength(commandMessage, message) {
        const embedBuilder = new discord_js_1.EmbedBuilder();
        if (commandMessage.options.length === 1) {
            embedBuilder.setColor(0x0099FF)
                .setTitle('Pose commands')
                .setDescription('List of available pose commands')
                .addFields({ name: 'Pose reference command', value: '!pose <type-option (pose, face, hands, animals, landscapes, urban)> <gender-option (all, female, male)> <clothing-option (all, nude&partiallynude, clothes&costumes)', inline: true }, { name: 'Pose help command', value: '!pose help' })
                .setTimestamp();
        }
        else {
            message.channel.send("Retrieving reference image...");
            message.channel.sendTyping();
            const reference = this.referenceRetriever.loadReference(commandMessage);
            embedBuilder.setColor(0x0099FF)
                .setTitle('Reference pose')
                .setDescription(`Reference pose found for: *${message.content}*`)
                .addFields({ name: 'Reference image', value: reference.referenceImage }, { name: 'Reference source | all rights belong to:', value: reference.source })
                .setImage(reference.referenceImage)
                .setTimestamp();
        }
        message.channel.send({ embeds: [embedBuilder] });
    }
}
exports.MessageEventHandler = MessageEventHandler;
//# sourceMappingURL=MessageEventHandler.js.map