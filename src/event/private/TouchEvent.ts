import { $target } from '../symbol/Touch'
import { View } from '../../view/View'
import { Emitter } from '../Emitter'
import { TouchEvent } from '../TouchEvent'


/**
 * @function updateTouchTarget
 * @since 0.1.0
 * @hidden
 */
export function updateTouchTarget(event: TouchEvent, target: View) {
	for (let touch of event.touches) {
		touch[$target] = target
	}
}