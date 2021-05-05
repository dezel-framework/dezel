import { Slot } from 'index'
import { $component } from './symbol/Body'
import { Component } from './Component'
import { Emitter } from 'event/Emitter'
import { View } from 'view/View'

/**
 * @class Body
 * @since 1.0.0
 */
export class Body extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The body's component.
	 * @property component
	 * @since 0.1.0
	 */
	public get component(): Component | null {
		return this[$component]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Attaches the body to a component.
	 * @method append
	 * @since 0.1.0
	 */
	public attach(component: Component) {

		if (this[$component] == null) {
			this[$component] = component
			return this
		}

		throw new Error(`Body error: The body is already bound to a compoment`)
	}

	/**
	 * Attaches the body to a component.
	 * @method detach
	 * @since 0.1.0
	 */
	public detach() {
		return this
	}

	/**
	 * Appends a child view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View | Slot) {

		let component = this[$component]
		if (component) {
			component.append(child)
			return this
		}

		throw new Error('Unexpected error.')
	}

	/**
	 * Inserts a child view at a specified index.
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View | Slot, index: number) {

		let component = this[$component]
		if (component) {
			component.insert(child, index)
			return this
		}

		throw new Error('Unexpected error.')
	}

	/**
	 * Removes a child view with another.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View) {

		let component = this[$component]
		if (component) {
			component.remove(child)
			return this
		}

		throw new Error('Unexpected error.')
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $component
	 * @since 0.1.0
	 * @hidden
	 */
	private [$component]: Component | null = null
}