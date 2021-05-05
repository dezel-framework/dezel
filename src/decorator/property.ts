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

	let get = function (this: any) {
		return getter ? getter.call(this) : this[key]
	}

	let set = function (this: any, value: boolean) {

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
