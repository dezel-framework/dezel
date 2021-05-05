import { $children } from 'view/symbol/Slot'
import { $offset } from 'view/symbol/Slot'
import { $parent } from 'view/symbol/Slot'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

/**
 * @function insertEntry
 * @since 0.1.0
 * @hidden
 */
export function insertEntry<T extends View = View>(slot: Slot<T>, child: View, index: number) {
	slot[$children].splice(index, 0, child)
}

/**
 * @function removeEntry
 * @since 0.1.0
 * @hidden
 */
export function removeEntry<T extends View = View>(slot: Slot<T>, child: View, index: number) {
	slot[$children].splice(index, 1)
}

/**
 * @function insertChild
 * @since 0.1.0
 * @hidden
 */
export function insertChild<T extends View = View>(slot: Slot<T>, child: View, index: number) {
	if (slot[$parent]) {
		slot[$parent].insert(child, index + slot[$offset])
	}
}

/**
 * @function removeChild
 * @since 0.1.0
 * @hidden
 */
export function removeChild<T extends View = View>(slot: Slot<T>, child: View, index: number) {
	if (slot[$parent]) {
		slot[$parent].remove(child)
	}
}