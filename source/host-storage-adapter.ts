
import * as crosscall from "crosscall"

import {
	OmniStorage,
	OmniStorageCallable,
	StorageEventHandler
} from "./interfaces"

export class HostStorageAdapter implements OmniStorage {
	private readonly storage: Storage

	constructor({storage}: {storage: Storage}) {
		this.storage = storage
	}

	async key(index: number): Promise<string> {
		return this.storage.key(index)
	}

	async getItem(key: string): Promise<string> {
		return this.storage.getItem(key)
	}

	async setItem(key: string, value: string): Promise<void> {
		return this.storage.setItem(key, value)
	}

	async removeItem(key: string): Promise<void> {
		return this.storage.removeItem(key)
	}

	async clear(): Promise<void> {
		return this.storage.clear()
	}

	// non standard

	async getAllEntries(): Promise<[string, string][]> {
		const entries: [string, string][] = []
		for (const key of Object.keys(this.storage))
			entries.push([key, this.storage[key]])
		return entries
	}

	async listen(handler: StorageEventHandler): Promise<void> {
		return
	}

	async unlisten(handler: StorageEventHandler): Promise<void> {
		return
	}
}
