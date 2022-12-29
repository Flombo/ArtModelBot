"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceRetriever = void 0;
const Reference_1 = require("../models/referenceModels/Reference");
const puppeteer_1 = require("puppeteer");
class ReferenceRetriever {
    constructor() {
        this.browser = null;
        this.page = null;
        this.previousReferences = new Array();
        this.currentReference = null;
    }
    loadReference(commandMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.retrieveReferenceFromSite(commandMessage);
        });
    }
    /**
     * Returns a reference equal to the entered command.
     * @param commandMessage
     * @private
     */
    retrieveReferenceFromSite(commandMessage) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.browser !== null) {
                    yield this.browser.close();
                    this.page = null;
                    this.browser = null;
                }
                this.browser = yield puppeteer_1.default.launch();
                this.page = yield this.browser.newPage();
                yield this.page.goto('https://quickposes.com/en/gestures/random');
                let options = commandMessage.options;
                yield this.makeReferenceSelection(this.page, options);
                // Need to wait until the DOM is completely loaded, else the reference won't be there.
                yield this.page.waitForNetworkIdle();
                const imgUrl = yield this.retrieveReferenceUrl(this.page);
                const imgOwner = yield this.retrieveReferenceOwner(this.page);
                this.currentReference = new Reference_1.Reference(imgUrl, imgOwner);
                return resolve(this.currentReference);
            }
            catch (e) {
                return reject(e);
            }
        }));
    }
    retrieveReferenceOwner(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield page.evaluate(() => {
                let owner = 'No owner data found';
                const spanImgOwner = document.querySelector('span.qp-image-owner');
                if (spanImgOwner.textContent.length > 0) {
                    owner = spanImgOwner.textContent;
                }
                return owner;
            });
        });
    }
    retrieveReferenceUrl(page) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield page.evaluate(() => {
                const images = document.querySelectorAll("img");
                return images[images.length - 1].src;
            });
        });
    }
    /**
     * Selects the reference options on the side equal to the entered command options and clicks on the Start-button.
     * @param page
     * @param options
     * @private
     */
    makeReferenceSelection(page, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield page.evaluate((options) => {
                let items = document.querySelectorAll('span.ui-button-text');
                items.forEach((item) => {
                    if (options.includes(item.innerText, 0)) {
                        item.click();
                    }
                    if (item.innerText === 'Start') {
                        item.click();
                    }
                });
            }, options);
        });
    }
    mirrorHorizontal() {
        return undefined;
    }
    mirrorVertical() {
        return undefined;
    }
    getNextReference() {
        if (this.page === null)
            throw new ReferenceError("Unable to load next reference. The session is already closed.");
        this.previousReferences.push(this.currentReference);
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.page.evaluate(() => {
                    const nextButton = document.querySelector('.button.next');
                    nextButton.click();
                });
                yield this.page.waitForNetworkIdle();
                const imageUrl = yield this.retrieveReferenceUrl(this.page);
                const owner = yield this.retrieveReferenceOwner(this.page);
                this.currentReference = new Reference_1.Reference(imageUrl, owner);
                return resolve(this.currentReference);
            }
            catch (e) {
                return reject(e);
            }
        }));
    }
    getPreviousReference() {
        if (this.browser === null)
            throw ReferenceError("Unable to retrieve previous reference. The session is already closed.");
        return this.previousReferences.pop();
    }
    stopSession() {
        if (this.browser !== null) {
            new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield this.page.evaluate(() => {
                        const endButton = document.querySelector('.button.close');
                        endButton.click();
                    });
                    this.previousReferences = new Array();
                    this.currentReference = null;
                    this.browser.close();
                    this.page = null;
                    this.browser = null;
                }
                catch (e) {
                    return reject(e);
                }
            }));
        }
    }
    isPreviousReferenceAvailable() {
        return this.previousReferences.length > 0;
    }
}
exports.ReferenceRetriever = ReferenceRetriever;
//# sourceMappingURL=ReferenceRetriever.js.map