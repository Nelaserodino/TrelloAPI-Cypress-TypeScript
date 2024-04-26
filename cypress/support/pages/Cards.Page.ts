import { processUrl } from '../types/urlData';
import type { urlList } from '../types/urlData';
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
}