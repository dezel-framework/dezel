import { Component } from 'component/Component'
import { state } from 'decorator/state'
import { Touch } from 'event/Touch'
import { TouchEvent } from 'event/TouchEvent'
import './ListItem.style'

/**
 * @class ListItem
 * @super Component
 * @since 0.1.0
 */
export abstract class ListItem extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the list item is selectable.
	 * @property selectable
	 * @since 0.1.0
	 */
	public selectable: boolean = true

	/**
	 * Whether the list item is pressed.
	 * @property pressed
	 * @since 0.1.0
	 */
	@state public pressed: boolean = false

	/**
	 * Whether the list item is selected.
	 * @property selected
	 * @since 0.1.0
	 */
	@state public selected: boolean = false

	/**
	 * Whether the list item is disabled.
	 * @property disabled
	 * @since 0.1.0
	 */
	@state public disabled: boolean = false

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method render
	 * @since 0.1.0
	 */
	public render() {
		return null
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onTouchStart
	 * @since 0.1.0
	 */
	public onTouchStart(event: TouchEvent) {

		if (this.disabled) {
			return
		}

		if (this.tracked == null) {
			this.tracked = event.touches.get(0)
			this.pressed = true
		}
	}

	/**
	 * @inherited
	 * @method onTouchEnd
	 * @since 0.1.0
	 */
	public onTouchEnd(event: TouchEvent) {

		if (this.disabled) {
			return
		}

		for (let touch of event.touches) {
			if (this.tracked == touch) {
				this.tracked = null
				this.pressed = false
				this.touched(touch)
				break
			}
		}
	}

	/**
	 * @inherited
	 * @method onTouchCancel
	 * @since 0.1.0
	 */
	public onTouchCancel(event: TouchEvent) {

		if (this.disabled) {
			return
		}

		for (let touch of event.touches) {
			if (this.tracked == touch) {
				this.tracked = null
				this.pressed = false
				break
			}
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @method tracked
	 * @since 0.1.0
	 * @hidden
	 */
	private tracked: Touch | null = null

	/**
	 * @method touched
	 * @since 0.1.0
	 * @hidden
	 */
	private touched(touch: Touch) {

		let target = this.window?.findViewAt(
			touch.x,
			touch.y
		)

		if (target == null) {
			return this
		}

		let inside = this.contains(target)
		if (inside) {
			this.emit('press')
		}

		return this
	}
}
