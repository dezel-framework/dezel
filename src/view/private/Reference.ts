import { renderIfNeeded } from 'component/private/Component'
import { Component } from 'component/Component'
import { $references } from 'view/symbol/Reference'
import { Reference } from 'view/Reference'

/**
 * @function createRef
 * @since 0.1.0
 * @hidden
 */
export function createRef(prototype: any, property: string) {

	let accessor = Symbol(property)

	Object.defineProperty(prototype, property, {

		set(value) {

			let reference = this[accessor]
			if (reference == null) {
				reference = this[accessor] = new Reference()
			}

			if (this instanceof Component) {
				renderIfNeeded(this)
			}

			this[accessor].set(value)
		},

		get() {

			let reference = this[accessor]
			if (reference == null) {
				reference = this[accessor] = new Reference()
			}

			if (this instanceof Component) {
				renderIfNeeded(this)
			}

			let value = reference.value
			if (value == null) {
				return reference
			}

			return value
		}

	})

	if (prototype[$references] == null) {
		prototype[$references] = []
	}

	prototype[$references].push(accessor)
}

/**
 * @function getRefName
 * @since 0.1.0
 * @hidden
 */
export function getRefName(accessor: Symbol) {
	return accessor.toString().slice(7, -1)
}