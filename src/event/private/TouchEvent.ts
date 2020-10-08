import { View } from 'view/View'
import { $target } from 'event/symbol/Touch'
import { TouchEvent } from 'event/TouchEvent'

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