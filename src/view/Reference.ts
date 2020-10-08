import { $value } from 'view/symbol/Reference'
import { Collection } from 'view/Collection'
import { View } from 'view/View'

/**
 * @class Reference
 * @since 0.1.0
 * @hidden
 */
export class Reference<T extends View | Collection> {

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

	/**
	 * Assigns the referenced value.
	 * @method set
	 * @since 0.1.0
	 */
	public set(value: T) {

		if (this[$value] == null) {
			this[$value] = value
			return this
		}

		throw new Error(`Reference error: Reference has already been set.`)
	}

	/**
	 * Returns the referenced value.
	 * @method get
	 * @since 0.1.0
	 */
	public get(): T {

		let value = this[$value]
		if (value != null) {
			return value
		}

		throw new Error(`Reference error: Unable to return a null reference.`)
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