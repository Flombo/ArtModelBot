import {CommandMessage} from "../models/CommandMessage";
import {Message} from "discord.js";
import { EmbedBuilder } from "discord.js";
import {IMessageEventHandler} from "./IMessageEventHandler";
import {IPoseCommandValidator} from "../validators/IPoseCommandValidator";
import {PoseCommandValidator} from "../validators/PoseCommandValidator";
import {IReferenceRetriever} from "../referenceRetriever/IReferenceRetriever";
import {ReferenceRetriever} from "../referenceRetriever/ReferenceRetriever";
import {IReference} from "../models/referenceModels/IReference";

export class MessageEventHandler implements IMessageEventHandler {

    private referenceRetriever : IReferenceRetriever;

    constructor() {
        this.referenceRetriever = new ReferenceRetriever();
    }

    public onMessageCreated(message : Message) : void {
        const commandMessage = new CommandMessage(message);
        const poseCommandValidator: IPoseCommandValidator = new PoseCommandValidator();

        if (commandMessage.command === null || commandMessage.command === undefined) return;

        if (!poseCommandValidator.isValid(commandMessage)) {
            message.channel.send(`Oops: *'${message.content}'* isn't a valid pose command to retrieve the possible pose-commands enter: !pose help`);
            return;
        }

        this.checkOptionsLength(commandMessage, message);

    }

    private checkOptionsLength(commandMessage : CommandMessage, message : Message) : void {

        const embedBuilder : EmbedBuilder = new EmbedBuilder();

        if (commandMessage.options.length === 1) {
                embedBuilder.setColor(0x0099FF)
                    .setTitle('Pose commands')
                    .setDescription('List of available pose commands')
                    .addFields(
                        { name: 'Pose reference command', value: '!pose <type-option (pose, face, hands, animals, landscapes, urban)> <gender-option (all, female, male)> <clothing-option (all, nude&partiallynude, clothes&costumes)', inline: true },
                        { name: 'Pose help command', value: '!pose help' },
                    )
                    .setTimestamp();

        } else {
            message.channel.send("Retrieving reference image...");
            message.channel.sendTyping();
            const reference : IReference = this.referenceRetriever.loadReference(commandMessage);
            embedBuilder.setColor(0x0099FF)
                .setTitle('Reference pose')
                .setDescription(`Reference pose found for: *${message.content}*`)
                .addFields(
                    { name: 'Reference image', value: reference.referenceImage },
                    { name: 'Reference source | all rights belong to:', value: reference.source },
                )
                .setImage(reference.referenceImage)
                .setTimestamp();

        }

        message.channel.send({ embeds: [embedBuilder] });
    }
}