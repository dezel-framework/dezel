import { Slot } from 'index'
import { $component } from 'component/symbol/Body'
import { Component } from 'component/Component'
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
	 * The body's parent.
	 * @property parent
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
	 * @method attach
	 * @since 0.1.0
	 */
	public attach(component: Component) {

		if (this[$component] == null) {
			this[$component] = component
			return this
		}

		throw new Error(`Body error: The body is already bound to a component`)
	}

	/**
	 * Attaches the body to a component.
	 * @method detach
	 * @since 0.1.0
	 */
	public detach() {

		if (this[$component]) {
			this[$component]!.empty()
			this[$component] = null
			return this
		}

		return this
	}

	/**
	 * Appends a child view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View | Slot) {

		let parent = this[$component]
		if (parent) {
			parent.append(child)
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

		let parent = this[$component]
		if (parent) {
			parent.insert(child, index)
			return this
		}

		throw new Error('Unexpected error.')
	}

	/**
	 * Removes a child view with another.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View | Slot) {

		let parent = this[$component]
		if (parent) {
			parent.remove(child)
			return this
		}

		throw new Error('Unexpected error.')
	}

	/**
	 * Removes the body from its component.
	 * @method removeFromParent
	 * @since 0.1.0
	 */
	public removeFromParent() {
		return this.detach()
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