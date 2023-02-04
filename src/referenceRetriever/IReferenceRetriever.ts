import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";

export interface IReferenceRetriever {

    /**
     * Loads the reference for the given command message
     * @param commandMessage
     */
    loadReference(commandMessage : CommandMessage) : Promise<IReference>;

    /**
     * Stops the current session and closes the
     */
    stopSession() : Promise<void>;

    /**
     * Returns the next reference for the previously send command
     */
    getNextReference() : Promise<IReference>;

    /**
     * Returns the previous shown reference
     */
    getPreviousReference() : IReference;

    /**
     * Checks if there are any previous references available.
     */
    isPreviousReferenceAvailable() : boolean;

    /**
     * Rotates the current reference clockwise
     */
    rotateClockwise() : Promise<IReference>;

    /**
     * Rotates the current reference counter-clockwise
     */
    rotateCounterClockwise() : Promise<IReference>;

    /**
     * Mirrors the current reference (which was maybe rotated before)
     */
    mirror() : Promise<IReference>;

}