import { $gesture } from 'component/symbol/Pannable'
import { watch } from 'decorator/watch'
import { PanGestureDetector } from 'gesture/PanGestureDetector'
import { View } from 'view/View'


/**
 * @class Pannable
 * @since 0.1.0
 */
export class Pannable {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the pan gesture is enabled.
	 * @property enabled
	 * @since 0.1.0
	 */
	@watch public enabled: boolean = true

	/**
	 * Whether the pan gesture should capture.
	 * @property capture
	 * @since 0.1.0
	 */
	@watch public capture: boolean = false

	/**
	 * The pannable's gesture.
	 * @property gesture
	 * @since 0.1.0
	 */
	public get gesture(): PanGestureDetector {
		return this[$gesture]
	}

	/**
	 * The pan gesture callback.
	 * @property onPan
	 * @since 0.1.0
	 */
	public onPan?: OnPan

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onCompose
	 * @since 0.1.0
	 */
	public onCompose(view: View) {
		this.gesture.capture = this.capture
		this.gesture.enabled = this.enabled
		view.gestures.append(this.gesture)
	}

	/**
	 * @inherited
	 * @method onPropertyChange
	 * @since 0.1.0
	 */
	public onPropertyChange(property: string, newValue: any, oldValue: any) {

		switch (property) {

			case 'enabled':
				this.gesture.enabled = newValue
				break

			case 'capture':
				this.gesture.capture = newValue
				break
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $gesture
	 * @since 0.1.0
	 * @hidden
	 */
	private [$gesture]: PanGestureDetector = new PanGestureDetector(gesture => {
		if (this.onPan) {
			this.onPan(gesture as PanGestureDetector)
		}
	})

	//--------------------------------------------------------------------------
	// JSX
	//--------------------------------------------------------------------------

	/**
	 * @property __jsxProps
	 * @since 0.1.0
	 * @hidden
	 */
	public __jsxProps: any
}

/**
 * @type OnPan
 * @since 0.1.0
 */
export type OnPan = (gesture: PanGestureDetector) => void