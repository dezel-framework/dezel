import { View } from 'view/View'

/**
 * @interface Composable
 * @since 0.1.0
 */
export interface Composable {

	/**
	 * Called when the receiver can manage the specifed view.
	 * @method onCompose
	 * @since 0.1.0
	 */
	onCompose(view: View): void
}