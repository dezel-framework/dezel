import { $body } from './symbol/Component'
import { $locked } from './symbol/Component'
import { $rendered } from './symbol/Component'
import { $sealed } from './symbol/Component'
import { $slots } from './symbol/Component'
import { render } from '../decorator/render'
import { native } from '../native/native'
import { getSlot } from './private/Component'
import { renderIfNeeded } from './private/Component'
import { Event } from '../event/Event'
import { Collection } from '../view/Collection'
import { Fragment } from '../view/Fragment'
import { View } from '../view/View'
import { Slot } from './Slot'

/**
 * @class Component
 * @super Emitter
 * @since 0.1.0
 */
export abstract class Component extends View {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * Prevents direct structural changes.
	 * @method seal
	 * @since 0.1.0
	 */
	public static seal(component: Component) {
		component[$sealed] = true
	}

	/**
	 * Prevents any structural changes.
	 * @method lock
	 * @since 0.1.0
	 */
	public static lock(component: Component) {
		component[$locked] = true
	}

	/**
	 * Allows direct structural changes.
	 * @method unseal
	 * @since 0.1.0
	 */
	public static unseal(component: Component) {
		component[$sealed] = false
	}

	/**
	 * Allows any structural changes.
	 * @method unlock
	 * @since 0.1.0
	 */
	public static unlock(component: Component) {
		component[$locked] = false
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the component is sealed.
	 * @property sealed
	 * @since 0.1.0
	 */
	public get sealed(): boolean {
		return this[$sealed]
	}

	/**
	 * Whether the component is locked.
	 * @property locked
	 * @since 0.1.0
	 */
	public get locked(): boolean {
		return this[$locked]
	}

	/**
	 * @inherited
	 * @property children
	 * @since 0.1.0
	 */
	@render public get children(): ReadonlyArray<View> {
		return super.children
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initialize the component.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor() {

		super()

		/*
		 * Making a component opaque limits the scope of the styles that can
		 * be applied. It is explained in further detail within the
		 * documentation.
		 */

		native(this).setOpaque()
	}

	/**
	 * Renders the component.
	 * @method render
	 * @since 0.1.0
	 */
	public abstract render(): Fragment | View | null

	/**
	 * @inherited
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View | Fragment, slot: string | null = null) {
		return this.insert(child, this.children.length, slot)
	}

	/**
	 * @inherited
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View | Fragment, index: number, slot: string | null = null) {

		if (this.locked) {
			throw new Error(`Component error: This component is locked.`)
		}

		if (slot) {

			let container = getSlot(this, slot)
			if (container) {
				container.insert(child, index)
				return this
			}

			throw new Error(`Component error: The component does not have a slot named ${slot}.`)
		}

		if (this.sealed) {

			let container = this[$body]
			if (container) {
				container.insert(child, index)
				return this
			}

			throw new Error(`Component error: The component is sealed.`)
		}

		return super.insert(child, index)
	}

	/**
	 * @inherited
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View, slot: string | null = null) {

		if (this.locked) {
			throw new Error(`Component error: This component is locked.`)
		}

		if (slot) {

			let container = getSlot(this, slot)
			if (container) {
				container.remove(child)
				return this
			}

			throw new Error(`Component error: The component does not have a slot named ${slot}.`)
		}

		if (this.sealed) {

			let container = this[$body]
			if (container) {
				container.remove(child)
				return this
			}

			throw new Error(`Component error: The component is sealed.`)
		}

		return super.remove(child)
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onEvent
	 * @since 0.1.0
	 */
	public onEvent(event: Event) {

		if (event.type == 'movetoparent') {

			/*
			 * Renders the component as soon as its being added to another
			 * view otherwise it might not be rendered at all.
			 */

			renderIfNeeded(this)
		}

		super.onEvent(event)
	}

	/**
	 * Called when the component is rendered.
	 * @method onRender
	 * @since 0.1.0
	 */
	public onRender() {

	}

	/**
	 * @method onPropertyChange
	 * @since 0.1.0
	 * @inherited
	 */
	public onPropertyChange(property: string, newValue: any, oldValue: any) {

	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $sealed
	 * @since 0.1.0
	 * @hidden
	 */
	private [$sealed]: boolean = false

	/**
	 * @property $locked
	 * @since 0.1.0
	 * @hidden
	 */
	private [$locked]: boolean = false

	/**
	 * @property $rendered
	 * @since 0.1.0
	 * @hidden
	 */
	private [$rendered]: boolean = false

	/**
	 * @property $slots
	 * @since 0.1.0
	 * @hidden
	 */
	private [$slots]: Dictionary<Slot> = {}

	/**
	 * @property $body
	 * @since 0.1.0
	 * @hidden
	 */
	private [$body]: Slot | null = null
}
