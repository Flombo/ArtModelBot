/**
 * Class that contains all necessary reference data, for displaying a reference or transforming it.
 * The referenceImage contains either a reference url or the actual reference image data.
 * The source contains the name of the reference owner.
 */
export interface IReference {

    Reference() : IReference;

    get referenceImage(): string;

    set referenceImage(value: string);

    get source(): string;

    set source(value: string);

    get height() : number;

    set height(value: number);

    get width() : number;

    set width(value: number);

}