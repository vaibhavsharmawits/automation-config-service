import { createFullfillment } from "../fullfillment-generator";

export async function onSearch1Generator(
	existingPayload: any,
	sessionData: any
) {
	existingPayload.message.catalog.providers[0].fulfillments =
		createFullfillment(sessionData.city_code).fulfillments;

	return existingPayload;
}
