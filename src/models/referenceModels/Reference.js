"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reference = void 0;
class Reference {
    constructor(referenceImage, source) {
        this.referenceImage = referenceImage;
        this.source = source;
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
}
exports.Reference = Reference;
//# sourceMappingURL=Reference.js.map