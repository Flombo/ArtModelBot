"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoseCommandValidator = void 0;
const PoseCommandEnum_1 = require("../models/referenceModels/PoseCommandEnum");
const PoseTypesEnum_1 = require("../models/referenceModels/PoseTypesEnum");
const PoseGendersEnum_1 = require("../models/referenceModels/PoseGendersEnum");
const PoseClothingEnum_1 = require("../models/referenceModels/PoseClothingEnum");
const PoseHelpEnum_1 = require("../models/referenceModels/PoseHelpEnum");
const InvalidPoseCommandError_1 = require("./InvalidPoseCommandError");
const InvalidPoseCommandEnum_1 = require("./InvalidPoseCommandEnum");
class PoseCommandValidator {
    isValid(commandMessage, messageContent) {
        const command = commandMessage.command;
        if (commandMessage.command !== PoseCommandEnum_1.PoseCommandEnum.pose)
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.pose);
        if (commandMessage.options === undefined || commandMessage.options.length < 1 || commandMessage.options.length > 3) {
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.optionLength);
        }
        if (commandMessage.options.length === 1) {
            if (commandMessage.options[0].startsWith('h')) {
                this.validateHelp(commandMessage.options[0], messageContent);
                return;
            }
        }
        this.handleValidationForCertainTypes(commandMessage, command);
    }
    handleValidationForCertainTypes(commandMessage, messageContent) {
        const type = commandMessage.options[0];
        const gender = commandMessage.options[1];
        const clothing = commandMessage.options[2];
        this.validateType(type, messageContent);
        switch (type) {
            /**
             *  pose takes a gender and clothing-filter {@link PoseTypesEnum}
             */
            case PoseTypesEnum_1.PoseTypesEnum.pose:
                this.validateGender(gender, messageContent);
                this.validateClothing(clothing, messageContent);
                break;
            /**
             *  face and hands need only the gender-filter {@link PoseTypesEnum}
             */
            case PoseTypesEnum_1.PoseTypesEnum.face:
            case PoseTypesEnum_1.PoseTypesEnum.hands:
                this.validateGender(gender, messageContent);
                break;
            /**
             * landscapes, animals and urban doesn't have any filter {@link PoseTypesEnum}
             */
            default:
                break;
        }
    }
    validateHelp(help, messageContent) {
        if (!Object.values(PoseHelpEnum_1.PoseHelpEnum).includes(help)) {
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.help);
        }
    }
    validateType(type, messageContent) {
        if (!Object.values(PoseTypesEnum_1.PoseTypesEnum).includes(type)) {
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.type);
        }
    }
    validateGender(gender, messageContent) {
        if (!Object.values(PoseGendersEnum_1.PoseGendersEnum).includes(gender)) {
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.gender);
        }
    }
    validateClothing(clothing, messageContent) {
        if (!Object.values(PoseClothingEnum_1.PoseClothingEnum).includes(clothing)) {
            throw new InvalidPoseCommandError_1.InvalidPoseCommandError(messageContent, InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.clothing);
        }
    }
}
exports.PoseCommandValidator = PoseCommandValidator;
//# sourceMappingURL=PoseCommandValidator.js.map