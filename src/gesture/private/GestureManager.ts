import { $gestures } from '../symbol/GestureManager'
import { GestureDetector } from '../GestureDetector'
import { GestureManager } from '../GestureManager'

/**
 * @function insertItem
 * @since 0.1.0
 * @hidden
 */
export function insertItem<T>(manager: GestureManager, gesture: GestureDetector<T>) {
	manager[$gestures].push(gesture)
}

/**
 * @function removeItem
 * @since 0.1.0
 * @hidden
 */
export function removeItem<T>(manager: GestureManager, gesture: GestureDetector<T>, index: number) {
	manager[$gestures].splice(index, 1)
}