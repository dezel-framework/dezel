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

		if (this[key] === undefined) {
			this[key] = value
			return
		}

		if (value) {
			this.styles.append(property)
		} else {
			this.styles.remove(property)
		}

		if (setter) {
			setter.call(this, value)
		}

		this[key] = value
	}

	Object.defineProperty(prototype, property, { get, set })
}

/**
 * @decorator style
 * @since 0.1.0
 */
export function style(prototype: object, property: string) {
	decorate(prototype, property)
}
