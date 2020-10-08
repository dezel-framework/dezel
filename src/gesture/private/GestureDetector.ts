import { Event } from 'event/Event'
import { $callback } from 'gesture/symbol/GestureDetector'
import { $canceled } from 'gesture/symbol/GestureDetector'
import { $detected } from 'gesture/symbol/GestureDetector'
import { $duration } from 'gesture/symbol/GestureDetector'
import { $finished } from 'gesture/symbol/GestureDetector'
import { $resolved } from 'gesture/symbol/GestureDetector'
import { $state } from 'gesture/symbol/GestureDetector'
import { GestureDetector } from 'gesture/GestureDetector'
import { State } from 'gesture/GestureDetector'

/**
 * @function setGestureState
 * @since 0.1.0
 * @hidden
 */
export function setGestureState<T>(gesture: GestureDetector<T>, state: State) {

	if (gesture.resolved) {
		throw new Error(`Gesture error: This gesture's state cannot be changed until it is reset.`)
	}

	if (gesture.state > state) {
		throw new Error(`Gesture error: This gesture's state cannot be changed to a lower value.`)
	}

	if (gesture.state == state &&
		gesture.state != State.Updated) {
		return
	}

	/*
	 * Allow a listener to cancel the gesture before it being detected. This
	 * can be useful for instance, when a pan gesture must start at a specific
	 * position.
	 */

	if (state == State.Detected) {

		let event = new Event('beforedetect', {
			propagable: false,
			cancelable: true,
		})

		gesture.emit(event)

		if (event.canceled) {
			state = State.Canceled
		}
	}

	gesture[$state] = state

	/*
	 * Dispatches state event for convenience.
	 */

	if (state == State.Detected) {

		gesture[$detected] = Date.now()
		gesture[$duration] = 0

		gesture.emit(
			new Event('detect', {
				propagable: false,
				cancelable: false,
			})
		)

	} else if (state == State.Canceled) {

		gesture[$canceled] = Date.now()
		gesture[$duration] = gesture[$finished] - gesture[$canceled]

		gesture.emit(
			new Event('cancel', {
				propagable: false,
				cancelable: false,
			})
		)

	} else if (state == State.Finished) {

		gesture[$finished] = Date.now()
		gesture[$duration] = gesture[$finished] - gesture[$detected]

		gesture.emit(
			new Event('finish', {
				propagable: false,
				cancelable: false,
			})
		)
	}

	if (state == State.Ignored ||
		state == State.Canceled ||
		state == State.Finished) {

		gesture[$resolved] = true

	} else {

		if (state == State.Updated ||
			state == State.Detected) {
			gesture[$callback].call(null, gesture as any)
		}

	}
}