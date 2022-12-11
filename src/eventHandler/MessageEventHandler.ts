import {CommandMessage} from "../models/CommandMessage";
import {Colors, Message, EmbedBuilder} from "discord.js";
import {IMessageEventHandler} from "./IMessageEventHandler";
import {IPoseCommandValidator} from "../validators/IPoseCommandValidator";
import {PoseCommandValidator} from "../validators/PoseCommandValidator";
import {IReferenceRetriever} from "../referenceRetriever/IReferenceRetriever";
import {ReferenceRetriever} from "../referenceRetriever/ReferenceRetriever";

export class MessageEventHandler implements IMessageEventHandler {

    private referenceRetriever : IReferenceRetriever;

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
        const embedBuilder: EmbedBuilder = new EmbedBuilder();

        this.referenceRetriever.loadReference(commandMessage).then(reference => {
            try {
                embedBuilder.setColor(0x0099FF)
                    .setTitle('Reference pose')
                    .setDescription(`Reference pose found for: *${message.content}*`)
                    .addFields(
                        {name: 'Reference image', value: reference.referenceImage},
                        {name: 'Reference source', value: 'https://quickposes.com'},
                        {name: 'Owner', value: reference.source}
                    )
                    .setImage(reference.referenceImage)
                    .setTimestamp();

                message.channel.send({embeds: [embedBuilder]});
            } catch (e) {
                embedBuilder.setColor(Colors.DarkRed)
                    .setTitle('Error while retrieving reference')
                    .setDescription(`Due to some errors no reference could retrieved for the command *${message.content}*`)
                    .setTimestamp();
            }
        });
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

}