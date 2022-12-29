import {IReferenceRetriever} from "./IReferenceRetriever";
import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";
import {Reference} from "../models/referenceModels/Reference";
import puppeteer, {Browser, Page} from 'puppeteer';

export class ReferenceRetriever implements IReferenceRetriever{

    private browser : Browser = null;
    private page : Page = null;
    private previousReferences : Array<IReference> = new Array<IReference>();
    private currentReference : IReference = null;

    async loadReference(commandMessage: CommandMessage): Promise<IReference> {
        return await this.retrieveReferenceFromSite(commandMessage);
    }

    /**
     * Returns a reference equal to the entered command.
     * @param commandMessage
     * @private
     */
    private retrieveReferenceFromSite(commandMessage : CommandMessage) : Promise<IReference> {

        return new Promise(async (resolve, reject) => {
            try {

                if(this.browser !== null) {
                    await this.browser.close();
                    this.page = null;
                    this.browser = null;
                }

                this.browser = await puppeteer.launch();

                this.page = await this.browser.newPage();
                await this.page.goto('https://quickposes.com/en/gestures/random');

                let options : Array<string> = commandMessage.options;

                await this.makeReferenceSelection(this.page, options)

                // Need to wait until the DOM is completely loaded, else the reference won't be there.
                await this.page.waitForNetworkIdle();

                const imgUrl : string = await this.retrieveReferenceUrl(this.page);
                const imgOwner = await this.retrieveReferenceOwner(this.page);

                this.currentReference = new Reference(imgUrl, imgOwner);

                return resolve(this.currentReference);
            } catch (e) {
                return reject(e);
            }
        });
    }

    private async retrieveReferenceOwner(page : Page) : Promise<string> {
        return await page.evaluate(() => {
            let owner : string = 'No owner data found';
            const spanImgOwner : HTMLSpanElement = document.querySelector('span.qp-image-owner');

            if(spanImgOwner.textContent.length > 0) {
                owner = spanImgOwner.textContent;
            }

            return owner;
        });
    }

    private async retrieveReferenceUrl(page : Page) : Promise<string> {
        return await page.evaluate(() => {
            const images : NodeListOf<HTMLImageElement> = document.querySelectorAll("img");
            return images[images.length - 1].src;
        });
    }

    /**
     * Selects the reference options on the side equal to the entered command options and clicks on the Start-button.
     * @param page
     * @param options
     * @private
     */
    private async makeReferenceSelection(page : Page, options : Array<string>) : Promise<void> {
        await page.evaluate((options : Array<string>) => {

            let items = document.querySelectorAll('span.ui-button-text');
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

    mirrorHorizontal(): IReference {
        return undefined;
    }

    mirrorVertical(): IReference {
        return undefined;
    }

    getNextReference(): Promise<IReference> {
        if(this.page === null) throw new ReferenceError("Unable to load next reference. The session is already closed.");
        this.previousReferences.push(this.currentReference);
        return new Promise(async (resolve, reject) => {
            try {
                await this.page.evaluate(() => {
                    const nextButton: HTMLSpanElement = document.querySelector('.button.next');
                    nextButton.click();
                });
                await this.page.waitForNetworkIdle();

                const imageUrl: string = await this.retrieveReferenceUrl(this.page);
                const owner: string = await this.retrieveReferenceOwner(this.page);

                this.currentReference = new Reference(imageUrl, owner);
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

    stopSession(): void {
        if(this.browser !== null) {
            new Promise(async (resolve, reject) => {
                try {
                    await this.page.evaluate(() => {
                        const endButton: HTMLSpanElement = document.querySelector('.button.close');
                        endButton.click();
                    });
                    this.previousReferences = new Array<IReference>();
                    this.currentReference = null;
                    this.browser.close();
                    this.page = null;
                    this.browser = null;
                } catch (e) {
                    return reject(e);
                }
            });

        }
    }

    isPreviousReferenceAvailable(): boolean {
        return this.previousReferences.length > 0;
    }

}