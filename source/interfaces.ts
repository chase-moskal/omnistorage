
import * as crosscall from "crosscall"

export type StorageEventHandler = (event: StorageEvent) => void

export interface OmniStorageCallable extends crosscall.Callable {
	omniStorage: OmniStorage
}

export interface OmniStorageCallee extends crosscall.Callee {
	omniStorage: OmniStorage
}

export interface OmniStorage extends crosscall.CallableTopic {
	key(index: number): Promise<string>
	getItem(key: string): Promise<string>
	setItem(key: string, value: string): Promise<void>
	removeItem(key: string): Promise<void>
	clear(): Promise<void>

	// non standard
	getAllEntries(): Promise<[string, string][]>
	listen(handler: StorageEventHandler): Promise<void>
	unlisten(handler: StorageEventHandler): Promise<void>
}
