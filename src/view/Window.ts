import { bridge } from '../native/bridge'
import { native } from '../native/native'
import { View } from './View'

@bridge('dezel.view.Window')

/**
 * @class Window
 * @super View
 * @since 0.1.0
 */
export class Window extends View {

	/**
	 * Finds the farthest view at a specified location.
	 * @method findViewAt
	 * @since 0.1.0
	 */
	public findViewAt(x: number, y: number): View {
		return native(this).findViewAt(x, y)
	}
}