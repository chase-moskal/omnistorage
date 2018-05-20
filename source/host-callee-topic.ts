
import * as crosscall from "crosscall"

import {
	XLocalStorage,
	ClientCallable,
	StorageEventHandler
} from "./interfaces"

export class HostCalleeTopic implements crosscall.CalleeTopic {
	[method: string]: crosscall.CalleeMethod

	async key(index: number): Promise<string> {
		return
	}

	async getItem<T>(key: string): Promise<T> {
		return
	}

	async setItem<T>(key: string, value: T): Promise<void> {
		return
	}

	async removeItem(key: string): Promise<void> {
		return
	}

	async clear(): Promise<void> {
		return
	}

	// non standard

	async getAllEntries<T>(): Promise<[string, T][]> {
		return
	}

	async listen(handler: StorageEventHandler): Promise<void> {
		return
	}

	async unlisten(handler: StorageEventHandler): Promise<void> {
		return
	}
}
