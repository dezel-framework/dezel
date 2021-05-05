import { $target } from 'event/symbol/Touch'
import { TouchEvent } from 'event/TouchEvent'
import { View } from 'view/View'

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