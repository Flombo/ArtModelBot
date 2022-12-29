import {CommandMessage} from "../models/CommandMessage";
import {
    Colors,
    Message,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonInteraction,
} from "discord.js";
import {IMessageEventHandler} from "./IMessageEventHandler";
import {IPoseCommandValidator} from "../validators/IPoseCommandValidator";
import {PoseCommandValidator} from "../validators/PoseCommandValidator";
import {IReferenceRetriever} from "../referenceRetriever/IReferenceRetriever";
import {ReferenceRetriever} from "../referenceRetriever/ReferenceRetriever";
import {IReference} from "../models/referenceModels/IReference";

export class PoseMessageEventHandler implements IMessageEventHandler {

    private referenceRetriever : IReferenceRetriever;
    private lastMessageContent : string;

    constructor() {
        this.referenceRetriever = new ReferenceRetriever();
    }

    public onMessageCreated(message : Message) : void {
        const commandMessage = new CommandMessage(message);
        const poseCommandValidator: IPoseCommandValidator = new PoseCommandValidator();

        if (commandMessage.command === null || commandMessage.command === undefined) return;

        try {
            poseCommandValidator.isValid(commandMessage, message.content);
        } catch (error) {
            message.channel.send(error.message);
            return;
        }

        this.lastMessageContent = message.content;
        this.checkOptionsLength(commandMessage, message);

    }

    private checkOptionsLength(commandMessage: CommandMessage, message: Message): void {
        if (commandMessage.options.length === 1 && commandMessage.options[0].startsWith("h")) {
            this.sendHelpMessage(message);
        } else {
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
    private sendReference(message : Message, commandMessage : CommandMessage) {
        try {
            this.referenceRetriever.loadReference(commandMessage).then(reference => {
                message.channel.send({embeds: [this.buildReferenceMessage(reference)], components: [this.createReferenceButtons()]});
            });
        } catch (e) {
            message.channel.send({embeds: [this.buildReferenceErrorMessage()]});
        }
    }

    private buildReferenceMessage(reference : IReference) : EmbedBuilder {
        const embedBuilder: EmbedBuilder = new EmbedBuilder();
        embedBuilder.setColor(0x0099FF)
            .setTitle('Reference pose')
            .setDescription(`Reference pose found for: *${this.lastMessageContent}*`)
            .addFields(
                {name: 'Reference image', value: reference.referenceImage},
                {name: 'Reference source', value: 'https://quickposes.com'},
                {name: 'Owner', value: reference.source}
            )
            .setImage(reference.referenceImage)
            .setTimestamp();
        return embedBuilder;
    }

    private buildReferenceErrorMessage() : EmbedBuilder {
        const embedBuilder: EmbedBuilder = new EmbedBuilder();
        embedBuilder.setColor(Colors.DarkRed)
            .setTitle('Error while retrieving reference')
            .setDescription(`Due to some errors no reference could retrieved for the command *${this.lastMessageContent}*`)
            .setTimestamp();
        return embedBuilder;
    }

    /**
     * Returns buttons for controlling the open quickposes session.
     * @private
     */
    private createReferenceButtons() : ActionRowBuilder<ButtonBuilder> {
        const actionRowBuilder : ActionRowBuilder<ButtonBuilder> = new ActionRowBuilder<ButtonBuilder>()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next reference')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('mirrorVertically')
                    .setLabel('Mirror vertically')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('mirrorHorizontally')
                    .setLabel('Mirror horizontally')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('stopSession')
                    .setLabel('Stop session')
                    .setStyle(ButtonStyle.Danger)
            );

        if(this.referenceRetriever.isPreviousReferenceAvailable()) {
            actionRowBuilder.addComponents(
                new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous reference')
                .setStyle(ButtonStyle.Primary)
            );
        }

        return actionRowBuilder;
    }

    private sendHelpMessage(message : Message) {
        const embedBuilder : EmbedBuilder = new EmbedBuilder();
        embedBuilder.setColor(0x0099FF)
            .setTitle('Pose commands')
            .setDescription('List of available pose commands')
            .addFields(
                {
                    name: 'Pose reference command',
                    value: '!pose <type-option (pose, face, hands, animals, landscapes, urban)> <gender-option (all, female, male)> <clothing-option (all, nude&partiallynude, clothes&costumes)',
                    inline: true
                },
                {name: 'Pose help command', value: '!pose help'},
            )
            .setTimestamp();

        message.channel.send({embeds: [embedBuilder]});
    }

    onButtonClicked(buttonInteraction: ButtonInteraction): void {
        try {
            switch (buttonInteraction.customId) {
                case 'next':
                    this.referenceRetriever.getNextReference().then(
                        nextReference => {
                            console.log(nextReference)
                            try {
                                buttonInteraction.reply({
                                    embeds: [this.buildReferenceMessage(nextReference)],
                                    components: [this.createReferenceButtons()]
                                });
                            } catch (e) {
                                buttonInteraction.reply({embeds: [this.buildReferenceErrorMessage()]});
                            }
                        }
                    );
                    break;
                case 'previous':
                    const previousReference: IReference = this.referenceRetriever.getPreviousReference();
                    buttonInteraction.reply({
                        embeds: [this.buildReferenceMessage(previousReference)],
                        components: [this.createReferenceButtons()]
                    });
                    break;
                case 'stopSession':
                    buttonInteraction.reply({content: 'Session stopped successfully'});
                    break;
                case '':
                    break;
            }
        } catch (e) {
            this.referenceRetriever.stopSession();
            buttonInteraction.reply({embeds: [this.buildReferenceErrorMessage()]});
        }
    }

}