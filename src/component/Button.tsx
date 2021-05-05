import { Dezel } from 'index'
import { property } from 'decorator/property'
import { state } from 'decorator/state'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Image } from 'component/Image'
import { Label } from 'component/Label'
import { Touch } from 'event/Touch'
import { TouchEvent } from 'event/TouchEvent'
import './Button.style'

/**
 * @class Button
 * @super Component
 * @since 0.1.0
 */
export class Button extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The button's label.
	 * @property label
	 * @since 0.1.0
	 */
	@property public label: string = ''

	/**
	 * The button's image.
	 * @property image
	 * @since 0.1.0
	 */
	@property public image: string = ''

	/**
	 * Whether the button is pressed.
	 * @property pressed
	 * @since 0.1.0
	 */
	@state public pressed: boolean = false

	/**
	 * Whether the button is selected.
	 * @property selected
	 * @since 0.1.0
	 */
	@state public selected: boolean = false

	/**
	 * Whether the button is disabled.
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
		console.log('Render button with label', this.label)
		return (
			<Body>
				{this.image && <Image path={this.image} id="image" />}
				{this.label && <Label text={this.label} id="label" />}
			</Body>
		)
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