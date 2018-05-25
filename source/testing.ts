
import * as crosscall from "crosscall"
import {TestHost, TestClient} from "crosscall/dist/testing"

import {OmniStorage} from "./interfaces"
import {HostStorageEventMediator} from "./host-storage-adapter"
import {prepareHost, PrepareHostParams, PrepareHostShims} from "./prepare-host"
import {prepareClient, PrepareClientParams, PrepareClientReturns} from "./prepare-client"

const sleep = async(duration: number) => new Promise((resolve, reject) => {
	setTimeout(resolve, duration)
})

export const nap = async() => sleep(10)

const makeStorageShim = (): Storage => ({
	length: <any>jest.fn(),
	clear: <any>jest.fn(),
	getItem: <any>jest.fn(),
	key: <any>jest.fn(),
	removeItem: <any>jest.fn(),
	setItem: <any>jest.fn()
})

export const goodOrigin = "https://localhost:8080"
export const badOrigin = "https://localhost:1111"
export const originRegex = /^https?:\/\/localhost/i

export interface TestParams {
	host: PrepareHostParams
	client: PrepareClientParams
}

export const makeTestParams = (): TestParams => ({
	host: {
		origin: originRegex,
		storage: makeStorageShim(),
		shims: {
			CrosscallHost: TestHost,
			HostStorageEventMediator: HostStorageEventMediator,
			crosscallShims: {
				postMessage: <any>jest.fn(),
				addEventListener: <any>jest.fn(),
				removeEventListener: <any>jest.fn()
			},
			storageEventShims: {
				addEventListener: <any>jest.fn(),
				removeEventListener: <any>jest.fn()
			}
		}
	},
	client: {
		CrosscallClient: <any>TestClient,
		link: `${goodOrigin}/omnistorage-host.html`,
		hostOrigin: goodOrigin,
		shims: {
			createElement: <any>jest.fn(),
			appendChild: <any>jest.fn(),
			removeChild: <any>jest.fn(),
			addEventListener: <any>jest.fn(),
			removeEventListener: <any>jest.fn(),
			postMessage: <any>jest.fn()
		}
	}
})

export const makeBridgedSetup = async(params: TestParams) => {

	// route host output to client input
	params.host.shims.crosscallShims.postMessage = jest.fn<typeof window.postMessage>(
		async(message: crosscall.Message, origin: string) => {
			await nap()
			client.crosscallClient.testReceiveMessage({message, origin: goodOrigin})
		}
	)

	// route client output to host input
	params.client.shims.postMessage = jest.fn<typeof window.postMessage>(
		async(message: crosscall.Message, origin: string) => {
			await nap()
			host.testReceiveMessage({message, origin: goodOrigin})
		}
	)

	// client created first, the way iframes work
	const client = await prepareClient<TestClient>(params.client)
	const host = await prepareHost<TestHost>(params.host)
	return {params, client, host}
}
