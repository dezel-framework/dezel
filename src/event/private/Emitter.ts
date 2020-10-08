import { append } from 'util/array'
import { remove } from 'util/array'
import { $callback } from 'event/symbol/Emitter'
import { $listeners } from 'event/symbol/Emitter'
import { $sender } from 'event/symbol/Event'
import { Emitter } from 'event/Emitter'
import { Event } from 'event/Event'

/**
 * @function getListeners
 * @since 0.1.0
 * @hidden
 */
export function getListeners(emitter: Emitter, type: string) {

	type = type.toLowerCase()

	let listeners = emitter[$listeners][type]
	if (listeners == null) {
		listeners = emitter[$listeners][type] = []
	}

	return listeners
}

/**
 * @function insertListener
 * @since 0.1.0
 * @hidden
 */
export function insertListener(emitter: Emitter, type: string, listener: any, single: boolean = false) {

	let listeners = getListeners(emitter, type)

	if (single) {

		/*
		 * Wraps the listener with a function that will remove itself
		 * once called. Keep a reference to the original function using
		 * a symbol.
		 */

		let callback = listener[$callback]
		if (callback == null) {
			listener = createSingleListener(emitter, type, listener)
		} else {
			listener = callback
		}
	}

	append(listeners, listener)
}

/**
 * @function removeListener
 * @since 0.1.0
 * @hidden
 */
export function removeListener(emitter: Emitter, type: string, listener: any) {

	let listeners = getListeners(emitter, type)

	let callback = listener[$callback]
	if (callback) {
		listener = callback
	}

	remove(listeners, listener)
}

/**
 * @function dispatchEvent
 * @since 0.1.0
 * @hidden
 */
export function dispatchEvent(emitter: Emitter, event: Event) {

	event[$sender] = emitter

	emitter.onEvent(event)

	if (event.canceled ||
		event.captured) {
		return
	}

	invokeListeners(emitter, event)

	if (event.canceled ||
		event.captured) {
		return
	}

	if (event.propagable == false) {
		return
	}

	let responder = emitter.responder
	if (responder) {
		dispatchEvent(responder, event)
	}
}

/**
 * @function invokeListeners
 * @since 0.1.0
 * @hidden
 */
export function invokeListeners(emitter: Emitter, event: Event) {
	getListeners(emitter, event.type).forEach(listener => listener.call(emitter, event))
}

/**
 * @function createSingleListener
 * @since 0.1.0
 * @hidden
 */
export function createSingleListener(emitter: Emitter, type: string, listener: any) {

	if (listener[$callback] == null) {
		listener[$callback] = function (event: Event) {
			invokeSingleListener(event.sender, listener, event)
			removeSingleListener(event.sender, listener, event)
		}
	}

	return listener[$callback]
}

/**
 * @function removeSingleListener
 * @since 0.1.0
 * @hidden
 */
export function removeSingleListener(emitter: Emitter, listener: any, event: Event) {

	let listeners = getListeners(emitter, event.type)

	let callback = listener[$callback]
	if (callback == null) {
		return
	}

	remove(listeners, callback)
}

/**
 * @function invokeSingleListener
 * @since 0.1.0
 * @hidden
 */
export function invokeSingleListener(emitter: Emitter, listener: any, event: Event) {
	listener.call(emitter, event)
}