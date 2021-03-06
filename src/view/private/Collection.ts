import { $items } from 'view/symbol/Collection'
import { $offset } from 'view/symbol/Collection'
import { $target } from 'view/symbol/Collection'
import { Collection } from 'view/Collection'
import { View } from 'view/View'

/**
 * @function insertItem
 * @since 0.1.0
 * @hidden
 */
export function insertItem(collection: Collection, child: View, index: number) {
	collection[$items].splice(index, 0, child)
}

/**
 * @function removeItem
 * @since 0.1.0
 * @hidden
 */
export function removeItem(collection: Collection, child: View, index: number) {
	collection[$items].splice(index, 1)
}

/**
 * @function insertView
 * @since 0.1.0
 * @hidden
 */
export function insertView(collection: Collection, child: View, index: number) {
	if (collection[$target]) {
		collection[$target].insert(child, index + collection[$offset])
	}
}

/**
 * @function removeView
 * @since 0.1.0
 * @hidden
 */
export function removeView(collection: Collection, child: View, index: number) {
	if (collection[$target]) {
		collection[$target].remove(child)
	}
}