
import * as crosscall from "crosscall"
import {TestHost, TestClient} from "crosscall/dist/testing"

import {prepareHost} from "./prepare-host"
import {prepareClient} from "./prepare-client"

import {
	nap,
	badOrigin,
	goodOrigin,
	makeTestParams,
	makeBridgedSetup
} from "./testing"

describe("omnistorage host and client", () => {
	it("can set and get items", async() => {
		const params = makeTestParams()
		const {client, host} = await makeBridgedSetup(params)
		const {storage} = params.host
		const key = "test"
		const value = "5"

		const omniStorage = await client.omniStorage
		omniStorage.setItem(key, value)
		const result = await omniStorage.getItem(key)

		expect((<jest.Mock>storage.setItem).mock.calls).toHaveLength(1)
		expect((<jest.Mock>storage.setItem).mock.calls[0]).toEqual([key, value])
		
		expect((<jest.Mock>storage.getItem).mock.calls).toHaveLength(1)
		expect((<jest.Mock>storage.getItem).mock.calls[0]).toEqual([key])
	})

	xit("events work, listeners can be added and removed", async() => {
		const params = makeTestParams()
		const {client, host} = await makeBridgedSetup(params)

		const secretPayload = {alpha: true}
		let result: any

		const storageEvent = await client.storageEvent
		storageEvent.listen((event: any) => { result = event.alpha })
		expect((<jest.Mock>params.client.shims.postMessage).mock.calls).toHaveLength(2)
		expect((<jest.Mock>params.host.shims.storageEventShims.addEventListener).mock.calls).toHaveLength(1)

		host.testFireEvent(0, secretPayload, goodOrigin)
		await nap()
		expect(result).toBe(true)
	})

	xit("fires events when localstorage is changed", async() => {
		expect(false).toBeTruthy()
	})
})
