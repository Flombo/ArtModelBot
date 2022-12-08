import {IPoseCommandValidator} from "./IPoseCommandValidator";
import {CommandMessage} from "../models/CommandMessage";
import {PoseCommandEnum} from "../models/referenceModels/PoseCommandEnum";
import {PoseTypesEnum} from "../models/referenceModels/PoseTypesEnum";
import {PoseGendersEnum} from "../models/referenceModels/PoseGendersEnum";
import {PoseClothingEnum} from "../models/referenceModels/PoseClothingEnum";
import {PoseHelpEnum} from "../models/referenceModels/PoseHelpEnum";
import {InvalidPoseCommandError} from "./InvalidPoseCommandError";
import {InvalidPoseCommandEnum} from "./InvalidPoseCommandEnum";

export class PoseCommandValidator implements IPoseCommandValidator {

    isValid(commandMessage: CommandMessage, messageContent : string): void {
        const command : string = commandMessage.command;
        if (commandMessage.command !== PoseCommandEnum.pose) throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.pose);
        if(commandMessage.options === undefined || commandMessage.options.length < 1 || commandMessage.options.length > 3) {
            throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.optionLength);
        }
        if(commandMessage.options.length === 1) {
            if(commandMessage.options[0].startsWith('h')) {
                this.validateHelp(commandMessage.options[0], messageContent);
                return;
            }
        }

        this.handleValidationForCertainTypes(commandMessage, command);
    }

    handleValidationForCertainTypes(commandMessage: CommandMessage, messageContent : string): void {
        const type : string = commandMessage.options[0];
        const gender : string = commandMessage.options[1];
        const clothing : string = commandMessage.options[2];

        this.validateType(type, messageContent);

        switch(type) {
            /**
             *  pose takes a gender and clothing-filter {@link PoseTypesEnum}
             */
            case PoseTypesEnum.pose:
                this.validateGender(gender, messageContent);
                this.validateClothing(clothing, messageContent);
                break;
            /**
             *  face and hands need only the gender-filter {@link PoseTypesEnum}
             */
            case PoseTypesEnum.face:
            case PoseTypesEnum.hands:
                this.validateGender(gender, messageContent)
                break;
            /**
             * landscapes, animals and urban doesn't have any filter {@link PoseTypesEnum}
             */
            default:
                break;
        }
    }

    validateHelp(help: string, messageContent : string): void {
        if(!Object.values(PoseHelpEnum).includes(help as PoseHelpEnum)) {
            throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.help);
        }
    }

    validateType(type: string, messageContent : string): void {
        if(!Object.values(PoseTypesEnum).includes(type as PoseTypesEnum)) {
            throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.type);
        }
    }

    validateGender(gender: string, messageContent : string): void {
        if(!Object.values(PoseGendersEnum).includes(gender as PoseGendersEnum)) {
            throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.gender);
        }
    }

    validateClothing(clothing: string, messageContent : string): void {
        if(!Object.values(PoseClothingEnum).includes(clothing as PoseClothingEnum)) {
            throw new InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum.clothing);
        }
    }

}