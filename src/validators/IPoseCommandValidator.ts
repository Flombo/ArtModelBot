import {CommandMessage} from "../models/CommandMessage";

export interface IPoseCommandValidator {
    /**
     * Checks if the entered CommandMessage is valid.
     * If that is not the case, an InvalidPoseCommandError will be thrown.
     * @param commandMessage
     * @param messageContent
     */
    isValid(commandMessage : CommandMessage, messageContent : string) : void;

    /**
     * Checks if the entered CommandMessage is of type help.
     * If not an InvalidPoseCommandError will be thrown.
     * @param help
     * @param messageContent
     */
    validateHelp(help : string, messageContent : string) : void;
}