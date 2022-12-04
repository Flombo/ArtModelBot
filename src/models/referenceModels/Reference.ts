import {IReference} from "./IReference";

export class Reference implements IReference {

    private _referenceImage : string;
    private _source : string;

    constructor(referenceImage : string, source : string) {
        this.referenceImage = referenceImage;
        this.source = source;
    }

    get referenceImage(): string {
        return this._referenceImage;
    }

    set referenceImage(value: string) {
        this._referenceImage = value;
    }

    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
    }
}