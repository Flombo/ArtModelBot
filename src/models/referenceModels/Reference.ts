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

    get width(): number {
        return this._width;
    }

    set height(value : number) {
        this._height = value;
    }

    set width(value : number) {
        this._width = value;
    }

    public switchWidthAndHeight() : void {
        const currentWidth = this.width;
        const currentHeight = this.height;
        this.height = currentWidth;
        this.width = currentHeight;
    }
}