export interface IReference {

    get referenceImage(): string;

    set referenceImage(value: string);

    get source(): string;

    set source(value: string);

    get height() : number;

    get width() : number;

    set height(value: number);

    set width(value: number);

    switchWidthAndHeight() : void;

}