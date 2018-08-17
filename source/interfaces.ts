
import * as crosscall from "crosscall"

import {
	HostStorageAdapter as HostStorageAdapterDefault,
	HostStorageEventMediator as HostStorageEventMediatorDefault
} from "./host-storage-adapter"

export type StorageEventHandler = (event: StorageEvent) => void

export interface OmniStorage {
	key(index: number): Promise<string>
	getItem(key: string): Promise<string>
	setItem(key: string, value: string): Promise<void>
	removeItem(key: string): Promise<void>
	clear(): Promise<void>

	// non standard
	getAllEntries(): Promise<[string, string][]>
}

export type OmniStorageCallableTopic = OmniStorage & crosscall.CallableTopic

export interface OmniStorageCallable extends crosscall.Callable {
	omniStorage: OmniStorageCallableTopic
}

export interface OmniStorageCallee extends crosscall.Callee {
	omniStorage: OmniStorageCallableTopic
}

export interface PrepareHostShims {
	CrosscallHost: typeof crosscall.Host
	HostStorageAdapter: typeof HostStorageAdapterDefault
	HostStorageEventMediator: typeof HostStorageEventMediatorDefault
	crosscallShims: crosscall.HostShims
	storageEventShims: HostStorageEventMediatorShims
}

export interface PrepareHostParams {
	origin: RegExp
	storage: Storage
	shims?: Partial<PrepareHostShims>
}

export interface HostStorageEventMediatorShims {
	addEventListener<E extends EventListener>(eventName: string, listener: E, useCapture?: boolean): void
	removeEventListener(eventName: string, listener: EventListener): void
}

export interface HostStorageEventMediatorOptions {
	storage: Storage
	shims?: HostStorageEventMediatorShims
}

export interface OmniStorageLocalClientOptions {
	storage: Storage
}
