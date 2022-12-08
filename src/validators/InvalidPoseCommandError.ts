import {InvalidPoseCommandEnum} from "./InvalidPoseCommandEnum";

export class InvalidPoseCommandError extends Error {
    constructor(command : string, errorReason : InvalidPoseCommandEnum) {
        super();
        this.buildErrorMessage(command, errorReason);
    }

    private buildErrorMessage(command : string, errorReason : InvalidPoseCommandEnum) : void {
        const helpMessage : string = this.buildHelpMessage(errorReason);
        this.message = `Oops: *${command}* isn't a valid pose command. ${helpMessage}. For more information enter !pose help`
    }

    private buildHelpMessage(errorReason : InvalidPoseCommandEnum) : string {
        let helpMessage : string = "A pose command must contain a valid";
        switch (errorReason) {
            case InvalidPoseCommandEnum.type:
                return helpMessage + " type (pose, face, hands, landscapes, animals or urban).";
            case InvalidPoseCommandEnum.gender:
                return helpMessage + " gender (all, female or male)";
            case InvalidPoseCommandEnum.clothing:
                return helpMessage + " clothing (all, nude&partiallynude or clothes&costumes)";
            case InvalidPoseCommandEnum.help:
                return "Did you mean 'help'?"
            case InvalidPoseCommandEnum.pose:
                return "Did you mean 'pose'?"
            case InvalidPoseCommandEnum.optionLength:
                return "A pose command needs between 1 to 3 options";
        }
    }
}