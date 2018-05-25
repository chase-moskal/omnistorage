
import * as crosscall from "crosscall"

import {
	OmniStorage,
	OmniStorageCallable,
	StorageEventHandler
} from "./interfaces"

export interface PrepareClientParams extends crosscall.ClientOptions {
	CrosscallClient?: typeof crosscall.Client
}

export interface StorageEventInterface extends crosscall.ClientEventMediator {
	listen(listener: StorageEventHandler): Promise<void>
	unlisten(listener: StorageEventHandler): Promise<void>
}

export interface PrepareClientReturns<GenericClient> {
	omniStorage: Promise<OmniStorage>
	storageEvent: Promise<StorageEventInterface>
	crosscallClient: GenericClient
}

export function prepareClient<GenericClient extends crosscall.Client = crosscall.Client>({
	CrosscallClient = crosscall.Client,
	...crosscallOptions
}: PrepareClientParams): PrepareClientReturns<GenericClient> {
	const client = new CrosscallClient<OmniStorageCallable>(crosscallOptions)
	const omniStorage = client.callable.then(callable => callable.omniStorage)
	const storageEvent = client.events.then(events => events.storage)
	return {
		omniStorage,
		storageEvent,
		crosscallClient: <any>client
	}
}
