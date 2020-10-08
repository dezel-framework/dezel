import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Image } from 'component/Image'
import { Label } from 'component/Label'
import { ref } from 'decorator/ref'
import { state } from 'decorator/state'
import { Touch } from 'event/Touch'
import { TouchEvent } from 'event/TouchEvent'
import './TabBarButton.style'

/**
 * @class TabBarButton
 * @super Component
 * @since 0.1.0
 */
export class TabBarButton extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The tab bar button's label.
	 * @property label
	 * @since 0.1.0
	 */
	@ref public label: Label

	/**
	 * The tab bar button's image.
	 * @property image
	 * @since 0.1.0
	 */
	@ref public image: Image

	/**
	 * The tab bar button's badge.
	 * @property badge
	 * @since 0.1.0
	 */
	@ref public badge: Label

	/**
	 * Whether the tab bar button is pressed.
	 * @property pressed
	 * @since 0.1.0
	 */
	@state public pressed: boolean = false

	/**
	 * Whether the tab bar button is selected.
	 * @property selected
	 * @since 0.1.0
	 */
	@state public selected: boolean = false

	/**
	 * Whether the tab bar button is disabled.
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
		return (
			<Body>
				<Image ref={this.image} id="image" />
				<Label ref={this.label} id="label" />
				<Label ref={this.badge} id="badge" visible={false} />
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