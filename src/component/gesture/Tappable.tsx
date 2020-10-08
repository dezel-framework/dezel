import { watch } from 'decorator/watch'
import { TapGestureDetector } from 'gesture/TapGestureDetector'
import { View } from 'view/View'
import { $gesture } from 'component/symbol/Tappable'
import { Composable } from 'component/interface/Composable'

/**
 * @class Tappable
 * @since 0.1.0
 */
export class Tappable implements Composable {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the tap gesture is enabled.
	 * @property enabled
	 * @since 0.1.0
	 */
	@watch public enabled: boolean = true

	/**
	 * Whether the tap gesture should capture the touches.
	 * @property capture
	 * @since 0.1.0
	 */
	@watch public capture: boolean = false

	/**
	 * The tappable's gesture.
	 * @property gesture
	 * @since 0.1.0
	 */
	public get gesture(): TapGestureDetector {
		return this[$gesture]
	}

	/**
	 * The tap gesture callback.
	 * @property onTap
	 * @since 0.1.0
	 */
	public onTap?: OnTap

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
	private [$gesture]: TapGestureDetector = new TapGestureDetector(gesture => {
		if (this.onTap) {
			this.onTap(gesture as TapGestureDetector)
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
 * @type OnTap
 * @since 0.1.0
 */
export type OnTap = (gesture: TapGestureDetector) => void