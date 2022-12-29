"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidPoseCommandError = void 0;
const InvalidPoseCommandEnum_1 = require("./InvalidPoseCommandEnum");
class InvalidPoseCommandError extends Error {
    constructor(command, errorReason) {
        super();
        this.buildErrorMessage(command, errorReason);
    }
    buildErrorMessage(command, errorReason) {
        const helpMessage = this.buildHelpMessage(errorReason);
        this.message = `Oops: *${command}* isn't a valid pose command. ${helpMessage}. For more information enter !pose help`;
    }
    buildHelpMessage(errorReason) {
        let helpMessage = "A pose command must contain a valid";
        switch (errorReason) {
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.type:
                return helpMessage + " type (pose, face, hands, landscapes, animals or urban).";
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.gender:
                return helpMessage + " gender (all, female or male)";
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.clothing:
                return helpMessage + " clothing (all, nude&partiallynude or clothes&costumes)";
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.help:
                return "Did you mean 'help'?";
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.pose:
                return "Did you mean 'pose'?";
            case InvalidPoseCommandEnum_1.InvalidPoseCommandEnum.optionLength:
                return "A pose command needs between 1 to 3 options";
        }
    }
}
exports.InvalidPoseCommandError = InvalidPoseCommandError;
//# sourceMappingURL=InvalidPoseCommandError.js.map