import { $dismissGestureState } from 'segue/symbol/Segue'
import { State } from 'gesture/GestureDetector'
import { Segue } from 'segue/Segue'
import { SegueRegistry } from 'segue/Segue'

/**
 * @method getRegisteredSegue
 * @since 0.1.0
 * @hidden
 */
export function getRegisteredSegue(segue: string) {

	let Segue = SegueRegistry.get(segue)
	if (Segue) {
		return new Segue()
	}

	throw new Error(`Segue error: The segue named ${segue} has not been registered.`)
}

/**
 * @method setDismissGestureState
 * @since 0.1.0
 * @hidden
 */
export function setDismissGestureState(segue: Segue, state: State) {

	if (segue[$dismissGestureState] > state) {
		throw new Error(`Gesture error: This gesture's state cannot be changed to a lower value.`)
	}

	if (segue[$dismissGestureState] == state &&
		segue[$dismissGestureState] != State.Updated) {
		return
	}

	segue[$dismissGestureState] = state
}