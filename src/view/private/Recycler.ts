import { $collection } from 'view/symbol/Recycler'
import { $items } from 'view/symbol/Collection'
import { Recycler } from 'view/Recycler'
import { View } from 'view/View'

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