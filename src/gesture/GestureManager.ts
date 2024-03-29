import { $gestures } from 'gesture/symbol/GestureManager'
import { $view } from 'gesture/symbol/GestureManager'
import { insertItem } from 'gesture/private/GestureManager'
import { removeItem } from 'gesture/private/GestureManager'
import { TouchEvent } from 'event/TouchEvent'
import { GestureDetector } from 'gesture/GestureDetector'
import { State } from 'gesture/GestureDetector'
import { View } from 'view/View'

/**
 * @class GestureManager
 * @since 0.1.0
 */
export class GestureManager {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The gesture manager's managed view.
	 * @property view
	 * @since 0.1.0
	 */
	public get view(): View {
		return this[$view]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(view: View) {
		this[$view] = view
	}

	/**
	 * @method append
	 * @since 0.1.0
	 */
	public append(gesture: GestureDetector) {

		if (gesture.view) {
			throw new Error(`Gesture error: This gesture has already been added to another view.`)
		}

		let index = this[$gestures].indexOf(gesture)
		if (index > -1) {
			return this
		}

		gesture.attach(this.view)
		gesture.reset()

		insertItem(this, gesture)

		return this
	}

	/**
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(gesture: GestureDetector) {

		let index = this[$gestures].indexOf(gesture)
		if (index == -1) {
			return this
		}

		gesture.detach()
		gesture.reset()

		removeItem(this, gesture, index)

		return this
	}

	//--------------------------------------------------------------------------
	// Methods - Events
	//--------------------------------------------------------------------------

	/**
	 * Called when the gesture manager receives a touch event.
	 * @method onTouchEvent
	 * @since 0.1.0
	 */
	public onTouchEvent(event: TouchEvent) {

		if (event.canceled) {
			return this
		}

		let captured = this[$gestures].find(gesture => {
			return (
				gesture.enabled &&
				gesture.captured &&
				gesture.resolved == false
			)
		})

		if (captured) {
			captured.dispatchTouchEvent(event)
		} else {

			for (let gesture of this[$gestures]) {

				if (gesture.resolved ||
					gesture.enabled == false) {
					continue
				}

				gesture.dispatchTouchEvent(event)

				if (gesture.capture == false) {
					continue
				}

				/*
				 * A gesture can capture a touch event when the gesture is
				 * detected for the first time. Once done, the following touch
				 * events will be forwarded to this gesture.
				 */

				if (gesture.state == State.Detected) {

					if (gesture.captured == false) {

						gesture.captureTouchEvent(event)

						this[$gestures].forEach(gesture => {
							if (gesture.captured == false) {
								gesture.reset()
							}
						})
					}

					break
				}
			}
		}

		/*
		 * Resets all the gesture when there are no more touch so they'll be
		 * usable again.
		 */

		if (event.activeTouches.length == 0) {
			this.reset()
		}
	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method reset
	 * @since 0.1.0
	 * @hidden
	 */
	public reset() {
		this[$gestures].forEach(gesture => gesture.reset())
		return this
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $view
	 * @since 0.1.0
	 * @hidden
	 */
	private [$view]: View

	/**
	 * @property $gestures
	 * @since 0.1.0
	 * @hidden
	 */
	private [$gestures]: Array<GestureDetector> = []
}
