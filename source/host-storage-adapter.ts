
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
}

export interface HostStorageEventMediatorShims {
	addEventListener<E extends EventListener>(eventName: string, listener: E, useCapture?: boolean): void
	removeEventListener(eventName: string, listener: EventListener): void
}

const eventName = "storage"
const useCapture = false

export interface HostStorageEventMediatorOptions {
	storage: Storage
	shims?: HostStorageEventMediatorShims
}

const makeDefaultShims = (): HostStorageEventMediatorShims => ({
	addEventListener: window.addEventListener.bind(window),
	removeEventListener: window.removeEventListener.bind(window)
})

export class HostStorageEventMediator implements crosscall.HostEventMediator {
	private readonly storage: Storage
	private readonly shims: HostStorageEventMediatorShims
	private readonly domHandlers = new Map<crosscall.Listener, StorageEventHandler>()

	constructor({storage, shims = makeDefaultShims()}: HostStorageEventMediatorOptions) {
		Object.assign(this, {storage, shims})
	}

	private makeDomHandler(crosscallListener: crosscall.Listener): StorageEventHandler {
		const domHandler: StorageEventHandler = event => {
			if (event.storageArea === this.storage) {
				crosscallListener(event)
			}
		}
		this.domHandlers.set(crosscallListener, domHandler)
		return domHandler
	}

	private trashDomHandler(crosscallListener: crosscall.Listener): StorageEventHandler {
		const domHandler = this.domHandlers.get(crosscallListener)
		if (!domHandler) throw new Error("could not find dom handler for crosscall listener in host-storage-adapter")
		this.domHandlers.delete(crosscallListener)
		return domHandler
	}

	listen(crosscallListener: crosscall.Listener) {
		const domHandler = this.makeDomHandler(crosscallListener)
		this.shims.addEventListener<StorageEventHandler>(eventName, domHandler, useCapture)
	}

	unlisten(crosscallListener: crosscall.Listener) {
		const domHandler = this.trashDomHandler(crosscallListener)
		this.shims.removeEventListener(eventName, domHandler)
	}
}
