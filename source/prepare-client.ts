
import * as crosscall from "crosscall"

import {
	XLocalStorage,
	ClientCallable,
	StorageEventHandler
} from "./interfaces"

export interface PrepareClientParams
	extends crosscall.ClientOptions {}

export async function prepareClient(
	params: PrepareClientParams
): Promise<XLocalStorage> {

	const crosscallClient =
		new crosscall.Client<ClientCallable>(params)

	return (await crosscallClient.callable).xLocalStorage
}
