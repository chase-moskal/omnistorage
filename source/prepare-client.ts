
import * as crosscall from "crosscall"

import {
	OmniStorage,
	OmniStorageCallable,
	StorageEventHandler
} from "./interfaces"

export interface PrepareClientParams extends crosscall.ClientOptions {
	CrosscallClient?: typeof crosscall.Client
}

export interface PrepareClientReturns<GenericClient> {
	omniStorage: Promise<OmniStorage>
	client: GenericClient
}

export function prepareClient<GenericClient extends crosscall.Client = crosscall.Client>({
	CrosscallClient = crosscall.Client,
	...crosscallOptions
}: PrepareClientParams): PrepareClientReturns<GenericClient> {
	const client = new CrosscallClient<OmniStorageCallable>(crosscallOptions)
	const omniStorage = client.callable.then(callable => callable.omniStorage)
	return {
		omniStorage,
		client: <any>client
	}
}
