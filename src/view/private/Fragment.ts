import { $children } from 'view/symbol/Fragment'
import { Collection } from 'view/Collection'
import { Fragment } from 'view/Fragment'
import { View } from 'view/View'

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
