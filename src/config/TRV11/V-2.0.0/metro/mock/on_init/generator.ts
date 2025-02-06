import { SessionData } from "../session-types";

export async function onInitGenerator(
	existingPayload: any,
	sessionData: SessionData
) {
	const randomId = Math.random().toString(36).substring(2, 15);

	const payments = [
		{
			id: randomId,
			params: {
				bank_code: "XXXXXXXX",
				bank_account_number: "xxxxxxxxxxxxxx",
			},
		},
	];
	existingPayload.message.order.payments = payments;
	if (sessionData.items.length > 0) {
		existingPayload.message.order.items = sessionData.items;
	}
	if (sessionData.fulfillments.length > 0) {
	existingPayload.message.order.fulfillments = sessionData.fulfillments;
	}
	if(sessionData.quote != null){
	existingPayload.message.order.quote = sessionData.quote
	}
	return existingPayload;
}
