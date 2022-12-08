import {CommandMessage} from "../models/CommandMessage";

export interface IPoseCommandValidator {
    isValid(commandMessage : CommandMessage, messageContent : string) : void;
    handleValidationForCertainTypes(commandMessage : CommandMessage, messageContent : string) : void;
    validateHelp(help : string, messageContent : string) : void;
    validateType(type : string, messageContent : string) : void;
    validateGender(gender : string, messageContent : string) : void;
    validateClothing(clothing : string, messageContent : string) : void;
}