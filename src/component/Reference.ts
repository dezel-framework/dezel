import { $value } from 'component/symbol/Reference'
import { Component } from 'component/Component'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

/**
 * @class Reference
 * @since 0.1.0
 * @hidden
 */
export class Reference<T> {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	public static create<T>(component: Component) {
		return new Reference<T>(component)
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The referenced value.
	 * @property value
	 * @since 0.1.0
	 */
	public get value(): T | null {
		return this[$value]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	constructor(component: Component) {

	}

	/**
	 * Assigns the referenced value.
	 * @method reset
	 * @since 0.1.0
	 */
	public reset(value: T) {
		this[$value] = value
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $value
	 * @since 0.1.0
	 * @hidden
	 */
	private [$value]: T | null = null

}