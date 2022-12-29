"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseMessageEventHandler = void 0;
const CommandMessage_1 = require("../models/CommandMessage");
const discord_js_1 = require("discord.js");
const PoseCommandValidator_1 = require("../validators/PoseCommandValidator");
const ReferenceRetriever_1 = require("../referenceRetriever/ReferenceRetriever");
class PoseMessageEventHandler {
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
        this.lastMessageContent = message.content;
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
        try {
            this.referenceRetriever.loadReference(commandMessage).then(reference => {
                message.channel.send({ embeds: [this.buildReferenceMessage(reference)], components: [this.createReferenceButtons()] });
            });
        }
        catch (e) {
            message.channel.send({ embeds: [this.buildReferenceErrorMessage()] });
        }
    }
    buildReferenceMessage(reference) {
        const embedBuilder = new discord_js_1.EmbedBuilder();
        embedBuilder.setColor(0x0099FF)
            .setTitle('Reference pose')
            .setDescription(`Reference pose found for: *${this.lastMessageContent}*`)
            .addFields({ name: 'Reference image', value: reference.referenceImage }, { name: 'Reference source', value: 'https://quickposes.com' }, { name: 'Owner', value: reference.source })
            .setImage(reference.referenceImage)
            .setTimestamp();
        return embedBuilder;
    }
    buildReferenceErrorMessage() {
        const embedBuilder = new discord_js_1.EmbedBuilder();
        embedBuilder.setColor(discord_js_1.Colors.DarkRed)
            .setTitle('Error while retrieving reference')
            .setDescription(`Due to some errors no reference could retrieved for the command *${this.lastMessageContent}*`)
            .setTimestamp();
        return embedBuilder;
    }
    /**
     * Returns buttons for controlling the open quickposes session.
     * @private
     */
    createReferenceButtons() {
        const actionRowBuilder = new discord_js_1.ActionRowBuilder()
            .setComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('next')
            .setLabel('Next reference')
            .setStyle(discord_js_1.ButtonStyle.Primary), new discord_js_1.ButtonBuilder()
            .setCustomId('mirrorVertically')
            .setLabel('Mirror vertically')
            .setStyle(discord_js_1.ButtonStyle.Secondary), new discord_js_1.ButtonBuilder()
            .setCustomId('mirrorHorizontally')
            .setLabel('Mirror horizontally')
            .setStyle(discord_js_1.ButtonStyle.Success), new discord_js_1.ButtonBuilder()
            .setCustomId('stopSession')
            .setLabel('Stop session')
            .setStyle(discord_js_1.ButtonStyle.Danger));
        if (this.referenceRetriever.isPreviousReferenceAvailable()) {
            actionRowBuilder.addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous reference')
                .setStyle(discord_js_1.ButtonStyle.Primary));
        }
        return actionRowBuilder;
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
    onButtonClicked(buttonInteraction) {
        try {
            switch (buttonInteraction.customId) {
                case 'next':
                    this.referenceRetriever.getNextReference().then(nextReference => {
                        console.log(nextReference);
                        try {
                            buttonInteraction.reply({
                                embeds: [this.buildReferenceMessage(nextReference)],
                                components: [this.createReferenceButtons()]
                            });
                        }
                        catch (e) {
                            buttonInteraction.reply({ embeds: [this.buildReferenceErrorMessage()] });
                        }
                    });
                    break;
                case 'previous':
                    const previousReference = this.referenceRetriever.getPreviousReference();
                    buttonInteraction.reply({
                        embeds: [this.buildReferenceMessage(previousReference)],
                        components: [this.createReferenceButtons()]
                    });
                    break;
                case 'stopSession':
                    this.referenceRetriever.stopSession();
                    buttonInteraction.reply({ content: 'Session stopped successfully' });
                    break;
                case '':
                    break;
            }
        }
        catch (e) {
            this.referenceRetriever.stopSession();
            buttonInteraction.reply({ embeds: [this.buildReferenceErrorMessage()] });
        }
    }
}
exports.PoseMessageEventHandler = PoseMessageEventHandler;
//# sourceMappingURL=PoseMessageEventHandler.js.map