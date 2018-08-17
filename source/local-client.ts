
import {OmniStorage, OmniStorageLocalClientOptions} from "./interfaces"

export class OmniStorageLocalClient implements OmniStorage {
	private readonly storage: Storage

	constructor(options: OmniStorageLocalClientOptions) {
		this.storage = options.storage
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
		const keys = Object.keys(this.storage)
		const entries = <[string, string][]>keys.map(
			key => [key, this.storage.getItem(key)]
		)
		return entries
	}
}
