
import * as crosscall from "crosscall"

import {
	XLocalStorage,
	ClientCallable,
	StorageEventHandler
} from "./interfaces"

import {HostCalleeTopic} from "./host-callee-topic"

export interface PrepareHostParams {
	origin: RegExp
}

export async function prepareHost({
	origin
}: PrepareHostParams): Promise<crosscall.Host> {
	return new crosscall.Host({
		callee: {
			xLocalStorage: new HostCalleeTopic()
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
