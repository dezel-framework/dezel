import { $slot } from 'view/symbol/View'
import { Event } from 'event/Event'
import { Constructor } from 'type/Constructor'
import { View } from 'view/View'

/**
 * @class Slot
 * @super Emitter
 * @since 0.1.0
 */
export class Slot<T extends View = View> extends View {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The slot's name.
	 * @propety name
	 * @since 0.1.0
	 */
	public name: string = ''

	/**
	 * The slot's main flag.
	 * @propety main
	 * @since 0.1.0
	 */
	public main: boolean = false

	/**
	 * The slot's type of content.
	 * @propety children
	 * @since 0.1.0
	 */
	public type: Constructor<T> | null = null

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View, index: number) {

		let type = this.type
		if (type) {

			if (child instanceof type == false) {
				throw new Error(`Slot Error: Slot does not allow content of type ${type.name}`)
			}

		}

		return super.insert(child, index)
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

		switch (event.type) {

			case 'insert':
				event.data.child[$slot] = this
				break

			case 'remove':
				event.data.child[$slot] = null
				break
		}

		super.onEvent(event)
	}
}