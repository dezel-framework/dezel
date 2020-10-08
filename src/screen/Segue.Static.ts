import { Screen } from 'screen/Screen'
import { Segue } from 'screen/Segue'
import { SegueRegistry } from 'screen/SegueRegistry'

/**
 * @class StaticSegue
 * @super Segue
 * @since 0.1.0
 */
export class StaticSegue extends Segue {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onBeforePresent
	 * @since 0.1.0
	 */
	public onBeforePresent(enter?: Screen, leave?: Screen) {

	}

	/**
	 * @inherited
	 * @method onPresent
	 * @since 0.1.0
	 */
	public onPresent(enter?: Screen, leave?: Screen) {
		return Promise.resolve()
	}

	/**
	 * @inherited
	 * @method onBeforeDismiss
	 * @since 0.1.0
	 */
	public onBeforeDismiss(enter?: Screen, leave?: Screen) {

	}

	/**
	 * @inherited
	 * @method onDismiss
	 * @since 0.1.0
	 */
	public onDismiss(enter?: Screen, leave?: Screen) {
		return Promise.resolve()
	}

	/**
	 * @inherited
	 * @method onAfterPresent
	 * @since 0.1.0
	 */
	public onAfterPresent(enter?: Screen, leave?: Screen) {

	}

	/**
	 * @inherited
	 * @method onAfterDismiss
	 * @since 0.1.0
	 */
	public onAfterDismiss(enter?: Screen, leave?: Screen) {

	}
}

SegueRegistry.set('static', StaticSegue)