
import * as crosscall from "crosscall"

export type StorageEventHandler = (event: StorageEvent) => void

export interface ClientCallable extends crosscall.Callable {
	xLocalStorage: XLocalStorage
}

export interface XLocalStorage extends crosscall.CallableTopic {
	key(index: number): Promise<string>
	getItem<T>(key: string): Promise<T>
	setItem<T>(key: string, value: T): Promise<void>
	removeItem(key: string): Promise<void>
	clear(): Promise<void>

	// non standard
	getAllEntries<T>(): Promise<[string, T][]>
	listen(handler: StorageEventHandler): Promise<void>
	unlisten(handler: StorageEventHandler): Promise<void>
}


