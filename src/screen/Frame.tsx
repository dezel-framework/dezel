import { $screen } from 'screen/symbol/Frame'
import { Screen } from 'screen/Screen'
import { View } from 'view/View'
import './Frame.style'

/**
 * @class Frame
 * @super View
 * @since 0.1.0
 */
export class Frame extends View {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The frame's screen.
	 * @property screen
	 * @since 0.1.0
	 */
	public get screen(): Screen {
		return this[$screen]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the frame.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(screen: Screen) {
		super()
		this[$screen] = screen
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onMoveToParent
	 * @since 0.1.0
	 */
	public onMoveToParent(parent: View | null, former: View | null) {

		if (parent) {
			this.append(this.screen)
			return
		}

		if (former) {
			this.remove(this.screen)
			return
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $screen
	 * @since 0.1.0
	 * @hidden
	 */
	private [$screen]: Screen
}