
import * as crosscall from "crosscall"
import {TestHost, TestClient} from "crosscall/dist/testing"

import {OmniStorage} from "./interfaces"
import {prepareHost} from "./prepare-host"
import {prepareClient} from "./prepare-client"

const sleep = async(duration: number) => new Promise((resolve, reject) => {
	setTimeout(resolve, duration)
})

const nap = async() => sleep(100)

class StorageShim implements Storage {
	[key: string]: any
	get length(): number { return 0 }
	clear() {}
	getItem(key: string): string { return "" }
	key(index: number): string { return "" }
	removeItem(key: string): void {}
	setItem(key: string, value: string): void {}
}

const makeStorageShim = (): Storage => ({
	length: <any>jest.fn(),
	clear: <any>jest.fn(),
	getItem: <any>jest.fn(),
	key: <any>jest.fn(),
	removeItem: <any>jest.fn(),
	setItem: <any>jest.fn()
})

const goodOrigin = "https://localhost:8080"
const badOrigin = "https://localhost:1111"

export interface TestShims {
	host: crosscall.HostShims
	client: crosscall.ClientShims
}

export const makeTestShims = (): TestShims => ({
	host: {
		postMessage: <any>jest.fn(),
		addEventListener: <any>jest.fn(),
		removeEventListener: <any>jest.fn()
	},
	client: {
		createElement: <any>jest.fn(),
		appendChild: <any>jest.fn(),
		removeChild: <any>jest.fn(),
		addEventListener: <any>jest.fn(),
		removeEventListener: <any>jest.fn(),
		postMessage: <any>jest.fn()
	}
})

const makeTestHost = async(shims: crosscall.HostShims) => {
	const storage = makeStorageShim()
	const host = prepareHost<TestHost>({
		origin: /^https?:\/\/localhost/i,
		storage,
		CrosscallHost: TestHost,
		shims
	})
	return {host, storage, shims}
}

const makeTestClient = async(shims: crosscall.ClientShims) => {
	const hostOrigin = "https://localhost:8080"
	const {omniStorage, client} = prepareClient<TestClient>({
		CrosscallClient: TestClient,
		link: `${hostOrigin}/omnistorage-host.html`,
		hostOrigin,
		shims
	})
	return {omniStorage, client, shims}
}

export const makeBridgedSetup = async(shims: TestShims) => {

	// route host output to client input
	shims.host.postMessage = jest.fn<typeof window.postMessage>(
		async(message: crosscall.Message, origin: string) => {
			await nap()
			client.testReceiveMessage({message, origin: goodOrigin})
		}
	)

	// route client output to host input
	shims.client.postMessage = jest.fn<typeof window.postMessage>(
		async(message: crosscall.Message, origin: string) => {
			await nap()
			host.testReceiveMessage({message, origin: goodOrigin})
		}
	)

	// client created first, the way iframes work
	const {omniStorage, client} = await makeTestClient(shims.client)
	const {host, storage} = await makeTestHost(shims.host)
	return {omniStorage: await omniStorage, client, host, storage}
}
