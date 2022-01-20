import { Body } from 'component/Body'
import { View } from 'view/View'

/**
 * @const $node
 * @since 0.1.0
 */
export const $node = Symbol('node')

/**
 * @type Descriptor
 * @since 0.1.0
 */
export type Descriptor<T = any, D = any> = {

	key?: any
	type: any
	attributes: any
	children: Array<Descriptor<T, D>>

	[$node]?: any // Body | View | Slot
}