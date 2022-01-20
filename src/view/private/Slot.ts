import { Slot } from 'view/Slot'
import { View } from 'view/View'


/**
 * @function canInsert
 * @since 0.1.0
 * @hidden
 */
export function canInsert<T extends View = View>(slot: Slot<T>, child: View | Slot) {
	// TODO
	if (slot.type) {
		if (child instanceof slot.type == false) {
			throw new Error('Slot does not allow type ' + slot.type)
		}
	}
}
