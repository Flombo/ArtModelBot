import {IPoseCommandValidator} from "./IPoseCommandValidator";
import {CommandMessage} from "../models/CommandMessage";
import {PoseCommandEnum} from "../models/referenceModels/PoseCommandEnum";
import {PoseTypesEnum} from "../models/referenceModels/PoseTypesEnum";
import {PoseGendersEnum} from "../models/referenceModels/PoseGendersEnum";
import {PoseClothingEnum} from "../models/referenceModels/PoseClothingEnum";
import {PoseHelpEnum} from "../models/referenceModels/PoseHelpEnum";

export class PoseCommandValidator implements IPoseCommandValidator {

    isValid(commandMessage: CommandMessage): boolean {
        let isValid : boolean = false;
        if (commandMessage.command !== PoseCommandEnum.pose) return isValid;
        if(commandMessage.options.length < 1) return isValid;
        if(commandMessage.options.length === 1) return this.validateHelp(commandMessage.options[0]);

        isValid = this.validateType(commandMessage.options[0]);
        isValid = this.validateGender(commandMessage.options[1]);
        isValid = this.validateClothing(commandMessage.options[2]);

        return isValid;
    }

    validateHelp(help: string): boolean {
        return Object.values(PoseHelpEnum).includes(help as PoseHelpEnum);
    }

    validateType(type: string): boolean {
        return Object.values(PoseTypesEnum).includes(type as PoseTypesEnum);
    }

    validateGender(gender: string): boolean {
        return Object.values(PoseGendersEnum).includes(gender as PoseGendersEnum);
    }

    validateClothing(clothing: string): boolean {
        return Object.values(PoseClothingEnum).includes(clothing as PoseClothingEnum);
    }

}