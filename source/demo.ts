
import {prepareHost, prepareClient, OmniStorage, StorageEventInterface} from "."

declare global {
	interface Window {
		demoHost: typeof demoHost
		demoClient: typeof demoClient
		omniStorage: OmniStorage
		storageEvent: StorageEventInterface
	}
}

const escapeRegex = (str: string): string => str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")

export async function demoHost() {
	const origin = new RegExp("^" + escapeRegex(window.location.origin) + "$", "i")
	const host = prepareHost({
		origin,
		storage: window.localStorage
	})
}

export async function demoClient() {
	const hostOrigin = window.location.origin

	const client = prepareClient({
		link: `${hostOrigin}/host.html`,
		hostOrigin
	})

	const [omniStorage, storageEvent] = await Promise.all([
		client.omniStorage,
		client.storageEvent
	])

	window["omniStorage"] = omniStorage
	window["storageEvent"] = storageEvent

	await omniStorage.clear()
	await omniStorage.setItem("a", "b")
	const result = await omniStorage.getItem("a")

	if (result === "b")
		console.log("omniStorage clear-setItem-getItem routine works")
	else
		throw new Error("omniStorage clear-setItem-getItem routine FAILED")
}

window.demoHost = demoHost
window.demoClient = demoClient
