import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";

export interface IReferenceRetriever {

    loadReference(commandMessage : CommandMessage) : Promise<IReference>;

    stopSession() : void;

    nextReference() : IReference;

    previousReference() : IReference;

    mirrorVertical() : IReference;

    mirrorHorizontal() : IReference;

}