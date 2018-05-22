
import * as crosscall from "crosscall"

import {
	XLocalStorage,
	ClientCallable,
	StorageEventHandler
} from "./interfaces"

import {HostCalleeTopic} from "./host-callee-topic"

export interface PrepareHostParams {
	origin: RegExp
	storage: Storage
}

export async function prepareHost({
	origin,
	storage
}: PrepareHostParams): Promise<crosscall.Host> {
	return new crosscall.Host({
		callee: {
			xLocalStorage: <crosscall.CalleeTopic><any>new HostCalleeTopic({storage})
		},
		permissions: [{
			origin,
			allowed: {
				localStorage: [
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
		}]
	})
}
