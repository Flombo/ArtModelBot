import {CommandMessage} from "../models/CommandMessage";

export interface IPoseCommandValidator {
    isValid(commandMessage : CommandMessage) : boolean;
    validateHelp(help : string) : boolean;
    validateType(type : string) : boolean;
    validateGender(gender : string) : boolean;
    validateClothing(clothing : string) : boolean;
}