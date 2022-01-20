import { $main } from 'view/symbol/Window'
import { bridge } from 'native/bridge'
import { native } from 'native/native'
import { View } from 'view/View'

@bridge('dezel.view.Window')

/**
 * @class Window
 * @super View
 * @since 0.1.0
 */
export class Window extends View {

	//--------------------------------------------------------------------------
	// Static Propertis
	//--------------------------------------------------------------------------

	/**
	 * @property $main
	 * @since 0.1.0
	 * @hiden
	 */
	private static [$main]: Window | null = null

	/**
	 * The main window.
	 * @property main
	 * @since 0.1.0
	 */
	public static get main(): Window | null {
		return this[$main]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initialize the application.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor() {

		super()

		let main = Window[$main]
		if (main) {
			main.destroy()
		}

		Window[$main] = this
	}

	/**
	 * Finds the farthest view at a specified location.
	 * @method findViewAt
	 * @since 0.1.0
	 */
	public findViewAt(x: number, y: number): View {
		return native(this).findViewAt(x, y)
	}
}