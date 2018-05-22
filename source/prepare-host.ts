
import * as crosscall from "crosscall"

import {HostCalleeTopic} from "./host-callee-topic"
import {
	OmniStorage,
	OmniStorageCallable,
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
			omniStorage: <any>new HostCalleeTopic({storage})
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
