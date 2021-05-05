import { Component } from 'component/Component'
import { View } from 'view/View'

/**
 * @type TextDescriptor
 * @since 0.1.0
 */
export type TextDescriptor = string | number

/**
 * @type BoolDescriptor
 * @since 0.1.0
 */
export type BoolDescriptor = boolean

/**
 * @type NullDescriptor
 * @since 0.1.0
 */
export type NullDescriptor = null | undefined

/**
 * @type NodeDescriptor
 * @since 0.1.0
 */
export type NodeDescriptor<T = any, D = any> = {
	node?: any
	type: any
	data: any
	children: Array<Descriptor<T, D>>
}

/**
 * @type Descriptor
 * @since 0.1.0
 */
export type Descriptor<T = any, D = any> = NodeDescriptor<T, D> | TextDescriptor | BoolDescriptor | NullDescriptor

/**
 * @function isTextDescriptor
 * @since 0.1.0
 */
export function isTextDescriptor(descriptor: Descriptor): descriptor is TextDescriptor {
	return (
		typeof descriptor == 'string' ||
		typeof descriptor == 'number'
	)
}

/**
 * @function isBoolDescriptor
 * @since 0.1.0
 */
export function isBoolDescriptor(descriptor: Descriptor): descriptor is BoolDescriptor {
	return typeof descriptor == 'boolean'
}

/**
 * @function isBoolDescriptor
 * @since 0.1.0
 */
export function isNullDescriptor(descriptor: Descriptor): descriptor is NullDescriptor {
	return descriptor == null
}

/**
 * @function isNodeDescriptor
 * @since 0.1.0
 */
export function isNodeDescriptor(descriptor: Descriptor): descriptor is NodeDescriptor {
	return descriptor != null && descriptor != undefined && typeof descriptor == 'object'
}