import { $gesture } from 'component/symbol/Tappable'
import { watch } from 'decorator/watch'
import { TapGestureDetector } from 'gesture/TapGestureDetector'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

/**
 * @class Tappable
 * @since 0.1.0
 */
export class Tappable extends Slot {

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
	 * Called after a view in inserted into the slot.
	 * @method onInsert
	 * @since 0.1.0
	 */
	public onInsert(child: View, index: number) {
		child.gestures.append(this.gesture)
	}

	/**
	 * Called after a view is removed from the collction.
	 * @method onRemove
	 * @since 0.1.0
	 */
	public onRemove(child: View, index: number) {
		child.gestures.remove(this.gesture)
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