import { renderIfNeeded } from '../component/private/Component'
import { Component } from '../component/Component'

/**
 * @function wrap
 * @since 0.1.0
 * @hidden
 */
const wrap = (func: any) => function (this: any) {

	if (this instanceof Component) {
		renderIfNeeded(this)
	}

	return func.apply(this, arguments)
}

/**
 * @function decorate
 * @since 0.1.0
 * @hidden
 */
function decorate(prototype: object, property: string) {

	let descriptor = Object.getOwnPropertyDescriptor(prototype, property)
	if (descriptor == null) {
		return
	}

	if (descriptor.set) wrap(descriptor.set)
	if (descriptor.get) wrap(descriptor.get)

	Object.defineProperty(prototype, property, descriptor)
}

/**
 * @decorator render
 * @since 0.1.0
 */
export function render(prototype: object, property: string) {
	decorate(prototype, property)
}
