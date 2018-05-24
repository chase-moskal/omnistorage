
import * as crosscall from "crosscall"

import {HostStorageAdapter} from "./host-storage-adapter"
import {
	OmniStorage,
	OmniStorageCallable,
	OmniStorageCallableTopic,
	OmniStorageCallee,
	StorageEventHandler
} from "./interfaces"

export interface PrepareHostParams {
	origin: RegExp
	storage: Storage
	CrosscallHost?: typeof crosscall.Host
	shims?: Partial<crosscall.HostShims>
}

export function prepareHost<gHost extends crosscall.Host = crosscall.Host>({
	origin,
	storage,
	CrosscallHost = crosscall.Host,
	shims = {}
}: PrepareHostParams): gHost {
	return <gHost>new CrosscallHost<OmniStorageCallee>({
		callee: {
			omniStorage: <OmniStorageCallableTopic><any>new HostStorageAdapter({storage})
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
					"getAllEntries",
					"listen",
					"unlisten"
				]
			}
		}],
		shims
	})
}
