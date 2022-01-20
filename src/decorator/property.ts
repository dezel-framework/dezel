import { Component } from 'component/Component'

/**
 * @function decorate
 * @since 0.1.0
 * @hidden
 */
function decorate(prototype: object, property: string) {

	let descriptor = Object.getOwnPropertyDescriptor(prototype, property)
	let getter = descriptor && descriptor.get
	let setter = descriptor && descriptor.set

	let key = Symbol()

	/**
	 * @function get
	 * @since 1.0.0
	 * @hidden
	 */
	function get(this: any) {
		return getter ? getter.call(this) : this[key]
	}

	/**
	 * @function set
	 * @since 1.0.0
	 * @hidden
	 */
	function set(this: any, value: boolean) {

		if (this instanceof Component) {
			this.scheduleRender()
		}

		if (setter) {
			setter.call(this, value)
		}

		this[key] = value
	}

	Object.defineProperty(prototype, property, { get, set })
}

/**
 * @decorator property
 * @since 0.1.0
 */
export function property(prototype: object, property: string) {
	decorate(prototype, property)
}
