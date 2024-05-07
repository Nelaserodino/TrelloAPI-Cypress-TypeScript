/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TrelloCardApi } from '../../support/pages/Cards.Page';
import type { GetListByIdResponse, GetCardByIdResponse, GetStickerByIdResponse, TrelloDataParams } from '../../support/types/Cards-responseType';
import dataJson from '../../fixtures/cards-data.json';
import { method, urlList } from '../../support/types/urlData';
import { faker } from '@faker-js/faker';

const dataParams: TrelloDataParams = dataJson as TrelloDataParams;
const description : string =  faker.commerce.productDescription();
const updatedDescription : string =  faker.commerce.productDescription();
const cardNameA : string =  faker.commerce.productName();
const updatedCardNameA : string =  faker.commerce.productName();

const createTrelloList = (options : {}) => {
	return TrelloCardApi.request(method.POST, urlList.createList, options).then(response => {
		expect(response).to.be.an('object');
		expect(response.status).to.eql(200);
		return response.body.id;
	});
};
const deleteTrelloList = (options : {}) => {
	return TrelloCardApi.request(method.PUT, urlList.deleteList, options).then(response => {
		expect(response).to.be.an('object');
		expect(response.status).to.eql(200);
	});
};


function checkListNaming(listId: string, listName: string) {
	const options = {
		idList: listId,
	};
	TrelloCardApi.request(method.GET, urlList.getList, options)
		.then(response => {
			const responseBody: GetListByIdResponse = response.body;
			expect(response).to.be.an('object');
			expect(response.status).to.eq(200);
			expect(response.body.name).to.eq(listName);
			expectedResultList(listId, responseBody);
		});
}

const expectedResultList = (listId : string, responseBody : GetListByIdResponse) => {
	expect(responseBody).to.have.property('id').that.is.equal(listId);
	expect(responseBody).to.have.property('id').that.is.a('string');
	expect(responseBody).to.have.property('name').that.is.a('string');
	expect(responseBody).to.have.property('closed').that.is.a('boolean');
	expect(responseBody).to.have.property('color').that.is.oneOf([null, 'string']);
	expect(responseBody).to.have.property('idBoard').that.is.a('string');
	expect(responseBody).to.have.property('pos').that.is.a('number');
};
const expectedResultCard = (cardId : string, responseBody : GetCardByIdResponse) => {
	expect(responseBody).to.have.property('id').that.is.equal(cardId);
	expect(responseBody).to.have.property('id').that.is.a('string');
	expect(responseBody).to.have.property('closed').that.is.a('boolean');
	expect(responseBody).to.have.property('idList').that.is.a('string');
	expect(responseBody).to.have.property('badges').that.is.an('object');
	expect(responseBody).to.have.property('checkItemStates').that.is.an('array');
	expect(responseBody).to.have.property('dueComplete').that.is.a('boolean');
	expect(responseBody).to.have.property('dateLastActivity').that.is.a('string');
	expect(responseBody).to.have.property('desc').that.is.a('string');
	expect(responseBody).to.have.property('descData').that.is.an('object');
	expect(responseBody).to.have.property('due').that.satisfies((due: string | null) => due === null || typeof due === 'string');
	expect(responseBody).to.have.property('dueReminder').that.satisfies((dueReminder: number | null) => dueReminder === null || typeof dueReminder === 'number');
	expect(responseBody).to.have.property('email').that.satisfies((email: string | null) => email === null || typeof email === 'string');
	expect(responseBody).to.have.property('idBoard').that.is.a('string');
	expect(responseBody).to.have.property('idChecklists').that.is.an('array');
	expect(responseBody).to.have.property('idMembers').that.is.an('array');
	expect(responseBody).to.have.property('idMembersVoted').that.is.an('array');
	expect(responseBody).to.have.property('idShort').that.is.a('number');
	expect(responseBody).to.have.property('idAttachmentCover').that.satisfies((id: string | null) => id === null || typeof id === 'string');
	expect(responseBody).to.have.property('labels').that.is.an('array');
	expect(responseBody).to.have.property('idLabels').that.is.an('array');
	expect(responseBody).to.have.property('manualCoverAttachment').that.is.a('boolean');
	expect(responseBody).to.have.property('name').that.is.a('string');
	expect(responseBody).to.have.property('pos').that.is.a('number');
	expect(responseBody).to.have.property('shortLink').that.is.a('string');
	expect(responseBody).to.have.property('shortUrl').that.is.a('string');
	expect(responseBody).to.have.property('start').that.satisfies((start: string | null) => start === null || typeof start === 'string');
	expect(responseBody).to.have.property('subscribed').that.is.a('boolean');
	expect(responseBody).to.have.property('url').that.is.a('string');
	expect(responseBody).to.have.property('cover').that.is.an('object');
	expect(responseBody).to.have.property('isTemplate').that.is.a('boolean');
	expect(responseBody).to.have.property('cardRole').that.satisfies((role: string | null) => role === null || typeof role === 'string');
};
const expectedStickerResult = (stickerId : string, responseBody : GetStickerByIdResponse) => {
	expect(responseBody).to.have.property('id').that.is.equal(stickerId);
	expect(responseBody).to.have.property('id').that.is.a('string');
	expect(responseBody).to.have.property('top').that.is.a('number');
	expect(responseBody).to.have.property('left').that.is.a('number');
	expect(responseBody).to.have.property('zIndex').that.is.a('number');
	expect(responseBody).to.have.property('rotate').that.is.a('number');
	expect(responseBody).to.have.property('image').that.is.a('string');
	expect(responseBody).to.have.property('imageUrl').that.is.a('string').and.includes('http');
	expect(responseBody).to.have.property('imageScaled').that.is.an('array');
};

describe('{API} Trello | Cards | Create Cards on a Board', () => {
	before('Precon: The user creates a Backlog, Active and Done Lists on a Board',() => {
		const optionsBacklog = {
			idBoard: dataParams.board.idBoard,
			name: dataParams.lists.backlog.name
		};
		const optionsActive = {
			idBoard: dataParams.board.idBoard,
			name: dataParams.lists.active.name
		};
		const optionsDone = {
			idBoard: dataParams.board.idBoard,
			name: dataParams.lists.done.name
		};
		createTrelloList(optionsBacklog).then(id => {
			dataParams.lists.backlog.id = id;
		});
		createTrelloList(optionsActive).then(id => {
			dataParams.lists.active.id = id;
		});
		createTrelloList(optionsDone).then(id => {
			dataParams.lists.done.id = id;
		});
	});
	beforeEach('The user creates a card on the Backlog list', () => {
		const options = {
			idList: dataParams.lists.backlog.id,
			body: {
				name: cardNameA,
				desc: description,
			}
		};
		TrelloCardApi.request(method.POST, urlList.createCard, options)
			.then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.name).to.eql(options.body.name);
				expect(response.body.desc).to.eql(options.body.desc);
				dataParams.cards.idCardA = response.body.id;
			});
	});
	it('Cards | TC1: Check that name of the list is BACKLOG', () => {
		checkListNaming(dataParams.lists.backlog.id, dataParams.lists.backlog.name);
	});
	it('Cards | TC2: Check that name of the list is ACTIVE', () => {
		checkListNaming(dataParams.lists.active.id, dataParams.lists.active.name);
	});
	it('Cards | TC3: Check that name of the list is DONE', () => {
		checkListNaming(dataParams.lists.done.id, dataParams.lists.done.name);
	});
	it('Cards | TC4: Check that the user can update Card A', () => {
		const updates = {
			idCard: dataParams.cards.idCardA,
			body: {
				name: updatedCardNameA,
				desc: updatedDescription,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, updates)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.name).to.eql(updates.body.name);
				expect(response.body.desc).to.eql(updates.body.desc);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('Cards | TC5: Check that the user can move Card A to Active List', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				idList: dataParams.lists.active.id,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.idList).to.eql(dataParams.lists.active.id);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('Cards | TC6: Check that the user can move Card A to Done List', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				idList: dataParams.lists.done.id,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.updateCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.idList).to.eql(dataParams.lists.done.id);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('Cards | TC7: Check that card A has status closed: false', () => {
		const card = {
			idCard: dataParams.cards.idCardA,
		};
		TrelloCardApi.request(method.GET, urlList.getCard, card)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response.body.closed).to.eql(false);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('Cards | TC8: Check that the user can archive card A', () => {
		const update = {
			idCard: dataParams.cards.idCardA,
			body: {
				closed: true,
			}
		};
		TrelloCardApi.request(method.PUT, urlList.getCard, update)
			.then(response => {
				const responseBody: GetCardByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.closed).to.eql(true);
				expectedResultCard(dataParams.cards.idCardA, responseBody);
			});
	});
	it('Cards-Stickers | TC9:Check that the user can Add a Sticker to card A', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA})
			.then(response => {
				const responseBody: GetStickerByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				dataParams.stickers.id = response.body.id;
				expectedStickerResult(dataParams.stickers.id, responseBody);
			});
	});
	it('Cards-Stickers | TC10:Check that the user can get a Sticker', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA})
			.then(response => {
				const responseBody: GetStickerByIdResponse = response.body;
				expect(response.status).to.eql(200);
				dataParams.stickers.id = response.body.id;
				dataParams.stickers.randomStickerName = response.body.image;
				expectedStickerResult(dataParams.stickers.id, responseBody);

				const options = {
					idCard: dataParams.cards.idCardA,
					idSticker: dataParams.stickers.id,
				};
				return TrelloCardApi.request(method.GET, urlList.getSticker, options);
			}).then(response => {
				const responseBody: GetStickerByIdResponse = response.body;
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				expect(response.body.image).to.eql(dataParams.stickers.randomStickerName);
				expect(response.body.id).to.eql(dataParams.stickers.id);
				expectedStickerResult(dataParams.stickers.id, responseBody);
			});
	});
	it('Cards-Stickers | TC11:Check that the user can update a Sticker', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA})
			.then(response => {
				const responseBody: GetStickerByIdResponse = response.body;
				expect(response.status).to.eql(200);
				dataParams.stickers.id = response.body.id;
				dataParams.stickers.randomStickerName = response.body.image;
				expectedStickerResult(dataParams.stickers.id, responseBody);

				const options = {
					idCard: dataParams.cards.idCardA,
					idSticker: dataParams.stickers.id,
					top: 10,
					left: 10,
					zIndex: 1,
				};

				return TrelloCardApi.request(method.PUT, urlList.updateSticker, options);
			})
			.then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
				const responseBody : GetStickerByIdResponse = response.body;
				expect(responseBody.image).to.eql(dataParams.stickers.randomStickerName);
				expect(responseBody.id).to.eql(dataParams.stickers.id);
				expectedStickerResult(dataParams.stickers.id, responseBody);
			});
	});
	it('Cards-Stickers | TC12:Check that the user can delete the sticker', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA})
			.then(response => {
				const responseBody: GetStickerByIdResponse = response.body;
				expect(response.status).to.eql(200);
				dataParams.stickers.id = response.body.id;
				dataParams.stickers.randomStickerName = response.body.image;
				expectedStickerResult(dataParams.stickers.id, responseBody);

				const options = {
					idCard: dataParams.cards.idCardA,
					idSticker: dataParams.stickers.id,
				};

				return TrelloCardApi.request(method.DELETE, urlList.getSticker, options);
			}).then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
			});
	});
	it('Cards-Stickers | TC13:Should return a 400 status when idCard is not valid for adding a sticker', () => {
		TrelloCardApi.addRandomSticker({idCard: 'not-valid-card-id'})
			.then(response => {
				expect(response.status).to.eq(400);
				expect(response.body).to.include(dataJson.errorMessage.invalidIdCard);
			});
	});
	it('Cards-Stickers | TC14:Should return a 404 status when required idCard is missing when adding a sticker', () => {
		TrelloCardApi.addRandomSticker({idCard: ''})
			.then(response => {
				expect(response.status).to.eq(404);
				expect(response.statusText).to.eq(dataJson.errorMessage.notFound);
			});
	});
	it('Cards-Stickers | TC15:Should return a 401 status when sticker name is invalid', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA, image: 'notValidSticker'}).then(response => {
			expect(response.status).to.eq(401);
			expect(response.body.message).to.include(dataJson.errorMessage.invalidSticker);
		});
	});
	it('Cards-Stickers | TC16:Should return a 400 status when top value is less than 60', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA, top:TrelloCardApi.generateNumberBelowMinus60() }).then(response => {
			expect(response.status).to.eq(400);
			expect(response.body).to.include(dataJson.errorMessage.invalidTop);
		});
	});
	it('Cards-Stickers | TC17:Should return a 400 status when top value is -61', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA, top: -61 }).then(response => {
			expect(response.status).to.eq(400);
			expect(response.body).to.include(dataJson.errorMessage.invalidTop);
		});
	});
	it('Cards-Stickers | TC18:Should return a 400 status when top value is 101', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA, top: 101 }).then(response => {
			expect(response.status).to.eq(400);
			expect(response.body).to.include(dataJson.errorMessage.invalidTop);
		});
	});
	it('Cards-Stickers | TC19:Should return a 400 status when top value is higher than 100', () => {
		TrelloCardApi.addRandomSticker({idCard: dataParams.cards.idCardA, top:TrelloCardApi.generateNumberAbove100() }).then(response => {
			expect(response.status).to.eq(400);
			expect(response.body).to.include(dataJson.errorMessage.invalidTop);
		});
	});
	afterEach('Check that the user can delete a card on the Backlog list', () => {
		const optionsBacklog = {
			idList: dataParams.lists.backlog.id
		};
		const optionsActive = {
			idList: dataParams.lists.active.id
		};
		TrelloCardApi.request(method.POST, urlList.archiveCardsInList, optionsBacklog)
			.then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
		});
		TrelloCardApi.request(method.POST, urlList.archiveCardsInList, optionsActive)
			.then(response => {
				expect(response).to.be.an('object');
				expect(response.status).to.eql(200);
		});
	});
	after('Delete all the created lists', () => {
		const optionsBacklog = {
			idList: dataParams.lists.backlog.id,
			body: {
				closed: true,
			}
		};
		const optionsActive = {
			idList: dataParams.lists.active.id,
			body: {
				closed: true,
			}
		};
		const optionsDone = {
			idList: dataParams.lists.done.id,
			body: {
				closed: true,
			}
		};
		deleteTrelloList(optionsBacklog);
		deleteTrelloList(optionsActive);
		deleteTrelloList(optionsDone);
	});
});