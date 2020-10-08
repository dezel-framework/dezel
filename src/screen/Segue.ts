import { Emitter } from 'event/Emitter'
import { State } from 'gesture/GestureDetector'
import { View } from 'view/View'
import { $dismissGestureState } from 'screen/symbol/Segue'
import { $dismissing } from 'screen/symbol/Screen'
import { $presented } from 'screen/symbol/Screen'
import { $presenting } from 'screen/symbol/Screen'
import { $screen } from 'screen/symbol/Segue'
import { $waiter } from 'screen/symbol/Segue'
import { emitBeforeEnter } from 'screen/private/Screen'
import { emitBeforeLeave } from 'screen/private/Screen'
import { emitDismiss } from 'screen/private/Screen'
import { emitEnter } from 'screen/private/Screen'
import { emitLeave } from 'screen/private/Screen'
import { isOverlay } from 'screen/private/Screen'
import { setDismissGestureState } from 'screen/private/segue'
import { Screen } from 'screen/Screen'
import { Waiter } from 'screen/private/waiter'

/**
 * @class Segue
 * @super Emitter
 * @since 0.1.0
 */
export class Segue extends Emitter {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * Returns a segue using its registered name.
	 * @method named
	 * @since 0.1.0
	 */
	public static named(name: string) {
		// TODO
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The segue's screen.
	 * @property screen
	 * @since 0.1.0
	 */
	public get screen(): Screen {
		return this[$screen]
	}

	/**
	 * The segue's animation duration.
	 * @property duration
	 * @since 0.1.0
	 */
	public duration: number = 350

	/**
	 * The segue's animation equation.
	 * @property equation
	 * @since 0.1.0
	 */
	public equation: string = 'default'

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Configures the segue.
	 * @method configure
	 * @since 0.1.0
	 */
	public configure() {

	}

	/**
	 * Disposes of the segue.
	 * @method dispose
	 * @since 0.1.0
	 */
	public dispose() {

	}

	/**
	 * Executes the segue presentation animation.
	 * @method present
	 * @since 0.1.0
	 */
	public present(enter?: Screen, leave?: Screen): Promise<void> {
		return this.transition(() => {
			this.onPresent(enter, leave)
		})
	}

	/**
	 * Executes the segue dismissal animation.
	 * @method dismiss
	 * @since 0.1.0
	 */
	public dismiss(enter?: Screen, leave?: Screen): Promise<void> {
		return this.transition(() => {
			this.onDismiss(enter, leave)
		})
	}

	/**
	 * Convenience method to perform a transition animation.
	 * @method transition
	 * @since 0.1.0
	 */
	public transition(animator: any): Promise<void> {
		return View.transition({
			duration: this.duration,
			equation: this.equation
		}, () => {
			animator()
		})
	}

	/**
	 * Pause the segue process until resumed.
	 * @method pause
	 * @since 0.1.0
	 */
	public pause() {

		if (this[$waiter] == null) {
			this[$waiter] = new Waiter()
		}

		return this
	}

	/**
	 * Resumes the segue process.
	 * @method done
	 * @since 0.1.0
	 */
	public resume() {
		this[$waiter]?.done()
		this[$waiter] = null
		return this
	}

	/**
	 * Returns a promise that resolves when the segue resumes.
	 * @method ready
	 * @since 0.1.0
	 */
	public ready() {

		let waiter = this[$waiter]
		if (waiter) {
			return waiter.promise
		}

		return Promise.resolve()
	}

	/**
	 * Tells the segue its dismiss gesture has been detected.
	 * @method detectDismissGesture
	 * @since 0.1.0
	 */
	public async detectDismissGesture() {

		try {

			let dismissedScreen = this.screen
			let presentedScreen = this.screen.presenter

			if (presentedScreen == null) {
				throw new Error(`Segue error: Missing presenter screen.`)
			}

			setDismissGestureState(this, State.Detected)

			dismissedScreen[$dismissing] = true
			presentedScreen[$presenting] = true

			presentedScreen.visible = true
			presentedScreen.resolve()

			this.onDismissGestureDetect(
				presentedScreen,
				dismissedScreen
			)

			presentedScreen.updateStatusBar()

			this.onBeforeDismiss(
				presentedScreen,
				dismissedScreen
			)

			await emitBeforeLeave(dismissedScreen, this)
			await emitBeforeEnter(presentedScreen, this)

		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Tells the segue its dismiss gesture has updated.
	 * @method updateDismissGesture
	 * @since 0.1.0
	 */
	public async updateDismissGesture() {

		try {

			let dismissedScreen = this.screen
			let presentedScreen = this.screen.presenter

			if (presentedScreen == null) {
				throw new Error(`Segue error: Missing presenter screen.`)
			}

			setDismissGestureState(this, State.Updated)

			this.onDismissGestureUpdate(
				presentedScreen,
				dismissedScreen
			)

		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Tells the segue its dismiss gesture has canceled.
	 * @method cancelDismmissGesture
	 * @since 0.1.0
	 */
	public async cancelDismmissGesture() {

		try {

			let window = this.screen.window!

			let dismissedScreen = this.screen
			let presentedScreen = this.screen.presenter

			if (presentedScreen == null) {
				throw new Error(`Segue error: Missing presenter screen.`)
			}

			setDismissGestureState(this, State.Canceled)

			window.touchable = false

			this.onDismissGestureCancel(
				presentedScreen,
				dismissedScreen
			)

			dismissedScreen.updateStatusBar()

			await this.present(
				dismissedScreen,
				presentedScreen
			)

			await emitEnter(dismissedScreen, this)
			await emitLeave(presentedScreen, this)

			presentedScreen.visible = isOverlay(presentedScreen) ? true : false

			dismissedScreen[$dismissing] = false
			presentedScreen[$presenting] = false

			this[$dismissGestureState] = State.Allowed

			window.touchable = true

		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * @method finishDismissGesture
	 * @since 0.1.0
	 * @hidden
	 */
	public async finishDismissGesture() {

		try {

			let window = this.screen.window!

			let dismissedScreen = this.screen
			let presentedScreen = this.screen.presenter

			if (presentedScreen == null) {
				throw new Error(`Segue error: Missing presenter screen.`)
			}

			window.touchable = false

			await this.dismiss(
				presentedScreen,
				dismissedScreen
			)

			this.onAfterDismiss(
				presentedScreen,
				dismissedScreen
			)

			emitLeave(dismissedScreen, this)
			emitDismiss(dismissedScreen, this)
			emitEnter(presentedScreen, this)

			dismissedScreen.dispose()

			dismissedScreen[$presented] = false
			presentedScreen[$presented] = true
			dismissedScreen[$presenting] = false
			presentedScreen[$presenting] = false

			this[$dismissGestureState] = State.Allowed

			window.touchable = true

		} catch (e) {
			console.error(e)
		}
	}

	/**
	 * Called before the screen is presented.
	 * @method onBeforePresent
	 * @since 0.1.0
	 */
	public onBeforePresent(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called before the screen is dismissed.
	 * @method onBeforeDismiss
	 * @since 0.1.0
	 */
	public onBeforeDismiss(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the screen is presented.
	 * @method onPresent
	 * @since 0.1.0
	 */
	public onPresent(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the screen is dismissed.
	 * @method onDismiss
	 * @since 0.1.0
	 */
	public onDismiss(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called after the screen has been presented.
	 * @method onAfterPresent
	 * @since 0.1.0
	 */
	public onAfterPresent(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called after the screen has been dismissed.
	 * @method onAfterDismiss
	 * @since 0.1.0
	 */
	public onAfterDismiss(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the dismiss gesture has been detected.
	 * @method onDismissGestureDetect
	 * @since 0.1.0
	 */
	public onDismissGestureDetect(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the dismiss gesture has been updated.
	 * @method onDismissGestureUpdate
	 * @since 0.1.0
	 */
	public onDismissGestureUpdate(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the dismiss gesture has been canceled.
	 * @method onDismissGestureCancel
	 * @since 0.1.0
	 */
	public onDismissGestureCancel(enter?: Screen, leave?: Screen) {

	}

	/**
	 * Called when the dismiss gesture has finished.
	 * @method onDismissGestureFinish
	 * @since 0.1.0
	 */
	public onDismissGestureFinish(enter?: Screen, leave?: Screen) {

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

	/**
	 * @property $waiter
	 * @since 0.1.0
	 * @hidden
	 */
	private [$waiter]: Waiter | null = null

	/**
	 * @property $dismissGestureState
	 * @since 0.1.0
	 * @hidden
	 */
	private [$dismissGestureState]: State = State.Allowed
}
