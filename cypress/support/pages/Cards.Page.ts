import { processUrl } from '../types/urlData';
import { urlList } from '../types/urlData';
import dataJson from '../../fixtures/cards-data.json';
import type { TrelloDataParams } from '../types/Cards-responseType';
const data: TrelloDataParams = dataJson as TrelloDataParams;

export class TrelloCardApi {
	static request(
		method: string,
		endpointKey: urlList,
		options?: {
            idCard?: string,
            idList?: string,
            body?: Record<string, any>
        }
	) {
		const apiKey = Cypress.env('trelloApiKey');
    	const token = Cypress.env('trelloToken');


		const params: Record<string, any> = { key: apiKey, token: token };
		Object.assign(params, options);
		let url = processUrl(endpointKey, params);

		return cy.request({
			method: method,
			url: url,
			body: options?.body,
		});
	}
	static getRandomInt(min : number, max : number) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static addRandomSticker(idCard: string) {
		const randomSticker = Math.floor(Math.random() * data.stickers.defaultStickers.length);
		const stickerImage = data.stickers.defaultStickers[randomSticker];
		const top = TrelloCardApi.getRandomInt(-60, 100);
		const left = TrelloCardApi.getRandomInt(-60, 100);
		const zIndex = TrelloCardApi.getRandomInt(0, 10);

		return TrelloCardApi.request('POST', urlList.addStickerToCard, {
			idCard: idCard,
			image: stickerImage,
			top: top,
			left: left,
			zIndex: zIndex
		});
	}
}