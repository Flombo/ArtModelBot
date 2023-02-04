import {IReference} from "./IReference";

export class Reference implements IReference {

    private _referenceImage : string;
    private _source : string;
    private _width : number;
    private _height : number;

    constructor(referenceImage : string, source : string, width : number, height : number) {
        this.referenceImage = referenceImage;
        this.source = source;
        this.width = width;
        this.height = height;
    }

    Reference(): IReference {
        return new Reference('', '', 0, 0);
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

    get height(): number {
        return this._height;
    }

    set height(value : number) {
        this._height = value;
    }

    get width(): number {
        return this._width;
    }
    set width(value : number) {
        this._width = value;
    }

}