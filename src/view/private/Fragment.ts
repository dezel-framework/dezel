import { $children } from '../symbol/Fragment'
import { Collection } from '../Collection'
import { Fragment } from '../Fragment'
import { View } from '../View'


/**
 * @function insertItem
 * @since 0.1.0
 * @hidden
 */
export function insertItem(fragment: Fragment, child: View | Collection, index: number) {
	fragment[$children].splice(index, 0, child)
}

/**
 * @function removeItem
 * @since 0.1.0
 * @hidden
 */
export function removeItem(fragment: Fragment, child: View | Collection, index: number) {
	fragment[$children].splice(index, 1)
}
