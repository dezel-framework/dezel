import { $items } from '../symbol/Collection'
import { $collection } from '../symbol/Recycler'
import { Recycler } from '../Recycler'
import { View } from '../View'

/**
 * @function insertView
 * @since 0.1.0
 * @hidden
 */
export function insertView<T>(recycler: Recycler<T>, child: View, index: number) {
	recycler[$collection][$items][index] = child
}

/**
 * @function removeView
 * @since 0.1.0
 * @hidden
 */
export function removeView<T>(recycler: Recycler<T>, child: View, index: number) {
	delete recycler[$collection][$items][index]
}