import {IReferenceRetriever} from "./IReferenceRetriever";
import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";
import {Reference} from "../models/referenceModels/Reference";

export class ReferenceRetriever implements IReferenceRetriever{

    loadReference(commandMessage: CommandMessage): IReference {
        return new Reference(
            'https://quickposes.com/assets/poses/24256ef72c8c12128d7bbc77e158b553.jpg',
            'https://quickposes.com/assets/poses/24256ef72c8c12128d7bbc77e158b553.jpg'
        );
    }

    mirrorHorizontal(): IReference {
        return undefined;
    }

    mirrorVertical(): IReference {
        return undefined;
    }

    nextReference(): IReference {
        return undefined;
    }

    previousReference(): IReference {
        return undefined;
    }

    stopSession(): void {
    }

}