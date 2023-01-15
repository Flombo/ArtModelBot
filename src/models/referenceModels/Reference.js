"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
class Reference {
    constructor(referenceImage, source, width, height) {
        this.referenceImage = referenceImage;
        this.source = source;
        this.width = width;
        this.height = height;
    }
    get referenceImage() {
        return this._referenceImage;
    }
    set referenceImage(value) {
        this._referenceImage = value;
    }
    get source() {
        return this._source;
    }
    set source(value) {
        this._source = value;
    }
    get height() {
        return this._height;
    }
    get width() {
        return this._width;
    }
    set height(value) {
        this._height = value;
    }
    set width(value) {
        this._width = value;
    }
    switchWidthAndHeight() {
        const currentWidth = this.width;
        const currentHeight = this.height;
        this.height = currentWidth;
        this.width = currentHeight;
    }
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map