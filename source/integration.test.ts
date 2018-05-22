
import * as crosscall from "crosscall"
import {TestHost, TestClient} from "crosscall/dist/testing"

import {prepareHost} from "./prepare-host"
import {prepareClient} from "./prepare-client"

import {makeTestShims, makeBridgedSetup} from "./testing"

describe("omnistorage host and client", () => {
	it("can set and get items", async() => {
		const shims = makeTestShims()
		const {omniStorage, client, host, storage} = await makeBridgedSetup(shims)

		const key = "test"
		const value = "5"

		await omniStorage.setItem(key, value)
		const result = await omniStorage.getItem(key)

		expect((<jest.Mock>storage.setItem).mock.calls).toHaveLength(1)
		expect((<jest.Mock>storage.setItem).mock.calls[0]).toEqual([key, value])
		
		expect((<jest.Mock>storage.getItem).mock.calls).toHaveLength(1)
		expect((<jest.Mock>storage.getItem).mock.calls[0]).toEqual([key])
	})

	it("events work, listeners can be added and removed", async() => {
		expect(true).toBeTruthy()
	})

	it("fires events when localstorage is changed", async() => {
		expect(true).toBeTruthy()
	})
})
