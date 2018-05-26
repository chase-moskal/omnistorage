
import * as crosscall from "crosscall"

import {
	HostStorageAdapter as HostStorageAdapterDefault,
	HostStorageEventMediator as HostStorageEventMediatorDefault,
	HostStorageEventMediatorShims
} from "./host-storage-adapter"

import {
	OmniStorage,
	OmniStorageCallable,
	OmniStorageCallableTopic,
	OmniStorageCallee,
	StorageEventHandler
} from "./interfaces"

export interface PrepareHostShims {
	CrosscallHost: typeof crosscall.Host
	HostStorageAdapter: typeof HostStorageAdapterDefault
	HostStorageEventMediator: typeof HostStorageEventMediatorDefault
	crosscallShims: crosscall.HostShims
	storageEventShims: HostStorageEventMediatorShims
}

export interface PrepareHostParams {
	origin: RegExp
	storage: Storage
	shims?: Partial<PrepareHostShims>
}

export function prepareHost<gHost extends crosscall.Host = crosscall.Host<OmniStorageCallee>>({
	origin,
	storage,
	shims = {}
}: PrepareHostParams): gHost {
	const {
		CrosscallHost = crosscall.Host,
		HostStorageAdapter = HostStorageAdapterDefault,
		HostStorageEventMediator = HostStorageEventMediatorDefault,
		crosscallShims,
		storageEventShims
	} = shims
	return <gHost>new CrosscallHost<OmniStorageCallee>({
		callee: {
			omniStorage: <OmniStorageCallableTopic><any>new HostStorageAdapter({storage})
		},
		events: {
			storage: new HostStorageEventMediator({storage, shims: storageEventShims})
		},
		permissions: [{
			origin,
			allowed: {
				omniStorage: [
					"key",
					"getItem",
					"setItem",
					"removeItem",
					"clear",
					"getAllEntries"
				]
			},
			allowedEvents: [
				"storage"
			]
		}],
		shims: crosscallShims
	})
}
