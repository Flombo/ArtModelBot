import {IReferenceRetriever} from "./IReferenceRetriever";
import {CommandMessage} from "../models/CommandMessage";
import {IReference} from "../models/referenceModels/IReference";
import {Reference} from "../models/referenceModels/Reference";
import puppeteer, {Page} from 'puppeteer';

export class ReferenceRetriever implements IReferenceRetriever{

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

                const browser = await puppeteer.launch();
                const page = await browser.newPage();
                await page.goto('https://quickposes.com/en/gestures/random');

                let options : Array<string> = commandMessage.options;

                await this.makeReferenceSelection(page, options)

                // Need to wait until the DOM is completely loaded, else the reference won't be there.
                await page.waitForNetworkIdle();

                const imgUrl : string = await this.retrieveReferenceUrl(page);
                const imgOwner = await this.retrieveReferenceOwner(page);

                await browser.close();
                return resolve(new Reference(imgUrl, imgOwner));
            } catch (e) {
                return reject(e);
            }
        });
    }

    private async retrieveReferenceOwner(page : Page) : Promise<string> {
        return await page.evaluate(() => {
            const spanImgOwner : HTMLSpanElement = document.querySelector('span.qp-image-owner');
            return spanImgOwner.textContent;
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
        await page.evaluate((cmd : Array<string>) => {

            let items = document.querySelectorAll('span.ui-button-text');
            items.forEach((item : HTMLElement) => {
                if(cmd.includes(item.innerText, 0)) {
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

    nextReference(): IReference {
        return undefined;
    }

    previousReference(): IReference {
        return undefined;
    }

    stopSession(): void {
    }

}