import {IReferenceRetriever} from "./IReferenceRetriever";
import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";
import {Reference} from "../models/referenceModels/Reference";
import puppeteer, {Browser, Page} from 'puppeteer';
import {Canvas, CanvasRenderingContext2D, createCanvas, loadImage} from 'canvas';

export class ReferenceRetriever implements IReferenceRetriever{

    private browser : Browser = null;
    private switchImgDimension = true;
    private previouslyRotated = false;
    private canvas : Canvas;
    private context : CanvasRenderingContext2D;
    private page : Page = null;
    private previousReferences : Array<IReference> = new Array<IReference>();
    private _currentReference : IReference = new Reference('', '', 0, 0);

    get currentReference(): IReference {
        return this._currentReference;
    }

    set currentReference(value: IReference) {
        this._currentReference = value;
    }

    async loadReference(commandMessage: CommandMessage): Promise<IReference> {
        return await this.retrieveReferenceFromSite(commandMessage);
    }

    private async retrieveReferenceFromSite(commandMessage : CommandMessage) : Promise<IReference> {

            if(this.browser !== null) {
                await this.browser.close();
                this.page = null;
                this.browser = null;
            }

            this.browser = await puppeteer.launch();

            this.page = await this.browser.newPage();
            await this.page.goto(process.env.REFERENCEURL);

            const options : Array<string> = commandMessage.options;

            await this.makeReferenceSelection(this.page, options)

            // Need to wait until the DOM is completely loaded, else the reference won't be there.
            await this.page.waitForNetworkIdle();

            this.currentReference = await this.retrieveReferenceUrl(this.page);
            this.currentReference.source = await this.retrieveReferenceOwner(this.page);
            this.previousReferences.push(this.currentReference);

            return this.currentReference;
    }

    private async retrieveReferenceOwner(page : Page) : Promise<string> {
        return await page.evaluate(() => {
            let owner = 'No owner data found';
            const spanImgOwner : HTMLSpanElement = document.querySelector('span.qp-image-owner');

            if(spanImgOwner.textContent.length > 0) {
                owner = spanImgOwner.textContent;
            }

            return owner;
        });
    }

    private async retrieveReferenceUrl(page : Page) : Promise<IReference> {
        const reference : IReference = new Reference('', '', 0, 0);
        return await page.evaluate((reference) => {
            const images : NodeListOf<HTMLImageElement> = document.querySelectorAll("img");
            const image = images[images.length - 1];
            reference.referenceImage = image.src;
            reference.source = '';
            reference.width = image.naturalWidth;
            reference.height = image.naturalHeight;
            return reference;
        }, reference);
    }

    /**
     * Selects the reference options on the side equal to the entered command options and clicks on the Start-button.
     * @param page
     * @param options
     * @private
     */
    private async makeReferenceSelection(page : Page, options : Array<string>) : Promise<void> {
        await page.evaluate((options : Array<string>) => {

            const items = document.querySelectorAll('span.ui-button-text');
            items.forEach((item : HTMLElement) => {
                if(options.includes(item.innerText, 0)) {
                    item.click();
                }

                if(item.innerText === 'Start') {
                    item.click();
                }
            });
        }, options);
    }

    async rotateCounterClockwise(): Promise<IReference> {
        return await this.rotate(false);
    }

    async rotateClockwise(): Promise<IReference> {
        return await this.rotate();
    }

    private async rotate(rotateRight = true) : Promise<IReference> {
        this.setupContextAndCanvas();
        const img = await loadImage(this.currentReference.referenceImage);

        const imgHeight : number = img.height;
        const imgWidth : number = img.width;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(this.canvas.width/2, this.canvas.height/2);

        if(rotateRight) {
            this.context.rotate(90 * Math.PI / 180);
        } else {
            this.context.rotate(-90 * Math.PI / 180);
        }

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.translate(-(this.canvas.width/2), -(this.canvas.height/2));
        this.context.drawImage(img, this.canvas.width/2 - imgWidth/2, this.canvas.height/2 - imgHeight/2, imgWidth, imgHeight);

        this.currentReference.referenceImage = this.canvas.toDataURL();
        this.previousReferences.push(this.currentReference);

        this.switchImgDimension = !this.switchImgDimension;
        this.previouslyRotated = true;

        return this.currentReference;
    }

    async mirror(): Promise<IReference> {
        this.switchImgDimension = this.previouslyRotated;
        this.setupContextAndCanvas();

        const img = await loadImage(this.currentReference.referenceImage);

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.scale(-1, 1);
        this.context.drawImage(img, -this.canvas.width, 0);

        this.currentReference.referenceImage = this.canvas.toDataURL();
        this.previousReferences.push(this.currentReference);

        return this.currentReference;
    }

    private setupContextAndCanvas() : void {

        let canvasWidth : number;
        let canvasHeight : number;

        if(this.switchImgDimension) {
            canvasHeight = this.currentReference.width;
            canvasWidth = this.currentReference.height;
        } else {
            canvasHeight = this.currentReference.height;
            canvasWidth = this.currentReference.width;
        }

        if(!this.context) {
            this.canvas = createCanvas(canvasWidth, canvasHeight);
            this.context = this.canvas.getContext('2d')
        }

        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;

    }

    getNextReference(): Promise<IReference> {
        if(this.page === null) throw new ReferenceError("Unable to load next reference. The session is already closed.");
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.evaluate(() => {
                    const nextButton: HTMLSpanElement = document.querySelector('.button.next');
                    nextButton.click();
                });
                await this.page.waitForNetworkIdle();

                const reference: IReference = await this.retrieveReferenceUrl(this.page);
                reference.source = await this.retrieveReferenceOwner(this.page);

                this.currentReference = reference;
                this.previousReferences.push(this.currentReference);
                return resolve(this.currentReference);
            } catch (e) {
                return reject(e);
            }
        });
    }

    getPreviousReference(): IReference {
        if(this.browser === null) throw ReferenceError("Unable to retrieve previous reference. The session is already closed.");
        return this.previousReferences.pop();
    }

    async stopSession(): Promise<void> {
        this.canvas = null;
        this.context = null;
        this.switchImgDimension = true;
        this.previouslyRotated = false;
        this.previousReferences = new Array<IReference>();
        this.currentReference = null;

        if(this.browser !== null) {
            await this.page.evaluate(() => {
                const endButton: HTMLSpanElement = document.querySelector('.button.close');
                endButton.click();
            });
            await this.browser.close();
            this.browser = null;
        }
        this.page = null;
    }

    isPreviousReferenceAvailable(): boolean {
        return this.previousReferences.length > 0;
    }

}