import { Emitter } from 'event/Emitter'
import { TouchEvent } from 'event/TouchEvent'
import { View } from 'view/View'
import { $callback } from 'gesture/symbol/GestureDetector'
import { $canceled } from 'gesture/symbol/GestureDetector'
import { $captured } from 'gesture/symbol/GestureDetector'
import { $detected } from 'gesture/symbol/GestureDetector'
import { $duration } from 'gesture/symbol/GestureDetector'
import { $finished } from 'gesture/symbol/GestureDetector'
import { $resolved } from 'gesture/symbol/GestureDetector'
import { $state } from 'gesture/symbol/GestureDetector'
import { $view } from 'gesture/symbol/GestureDetector'
import { setGestureState } from 'gesture/private/GestureDetector'

/**
 * @class GestureDetector
 * @super Emitter
 * @since 0.1.0
 */
export abstract class GestureDetector<T = any> extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the gesture is enabled.
	 * @property enabled
	 * @since 0.1.0
	 */
	public enabled: boolean = true

	/**
	 * Whether the gesture should capture the touches.
	 * @property capture
	 * @since 0.1.0
	 */
	public capture: boolean = false

	/**
	 * The gesture's view.
	 * @property view
	 * @since 0.1.0
	 */
	public get view(): View | null {
		return this[$view]
	}

	/**
	 * The gesture's state.
	 * @property state
	 * @since 0.1.0
	 */
	public get state(): State {
		return this[$state]
	}

	/**
	 * Whether the gesture has captured the touches.
	 * @property captured
	 * @since 0.1.0
	 */
	public get captured(): boolean {
		return this[$captured]
	}

	/**
	 * Whether the gesture has resolved.
	 * @property resolved
	 * @since 0.1.0
	 */
	public get resolved(): boolean {
		return this[$resolved]
	}

	/**
	 * The length in time of the gesture.
	 * @property duration
	 * @since 0.1.0
	 */
	public get duration(): number {
		return this[$duration]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the gesture.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(callback: GestureDetectorCallback<T>, options: GestureDetectorOptions = {}) {

		super()

		let opts = {
			...OPTIONS,
			...options
		}

		this.enabled = opts.enabled
		this.capture = opts.capture

		this[$callback] = callback
	}

	/**
	 * Tells the gesture it has been ignored.
	 * @method ignore
	 * @since 0.1.0
	 */
	public ignore() {
		return setGestureState<T>(this, State.Ignored)
	}

	/**
	 * Tells the gesture it has been detected.
	 * @method detect
	 * @since 0.1.0
	 */
	public detect() {
		return setGestureState<T>(this, State.Detected)
	}

	/**
	 * Tells the gesture it has been updated.
	 * @method update
	 * @since 0.1.0
	 */
	public update() {
		return setGestureState<T>(this, State.Updated)
	}

	/**
	 * Tells the gesture it has been finished.
	 * @method finish
	 * @since 0.1.0
	 */
	public finish() {
		return setGestureState<T>(this, State.Finished)
	}

	/**
	 * Tells the gesture it as been canceled.
	 * @method cancel
	 * @since 0.1.0
	 */
	public cancel() {
		return setGestureState<T>(this, State.Canceled)
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * Called on a touchstart event.
	 * @method onTouchStart
	 * @since 0.1.0
	 */
	public onTouchStart(event: TouchEvent) {

	}

	/**
	 * Called on a touchmove event.
	 * @method onTouchMove
	 * @since 0.1.0
	 */
	public onTouchMove(event: TouchEvent) {

	}

	/**
	 * Called on a touchend event.
	 * @method onTouchEnd
	 * @since 0.1.0
	 */
	public onTouchEnd(event: TouchEvent) {

	}

	/**
	 * Called on touchcancel event.
	 * @method onTouchCancel
	 * @since 0.1.0
	 */
	public onTouchCancel(event: TouchEvent) {
		this.cancel()
	}

	/**
	 * Called hen the gesture is reseted.
	 * @method onReset
	 * @since 0.1.0
	 */
	public onReset() {

	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method attach
	 * @since 0.1.0
	 * @hidden
	 */
	public attach(view: View) {
		this[$view] = view
	}

	/**
	 * @method detach
	 * @since 0.1.0
	 * @hidden
	 */
	public detach() {
		this[$view] = null
	}

	/**
	 * @method dispatchTouchEvent
	 * @since 0.1.0
	 * @hidden
	 */
	public dispatchTouchEvent(event: TouchEvent) {

		switch (event.type) {

			case 'touchstart':
				this.onTouchStart(event)
				break

			case 'touchmove':
				this.onTouchMove(event)
				break

			case 'touchend':
				this.onTouchEnd(event)
				break

			case 'touchcancel':
				this.onTouchCancel(event)
				break
		}

		return this
	}

	/**
	 * @method captureTouchEvent
	 * @since 0.1.0
	 * @hidden
	 */
	public captureTouchEvent(event: TouchEvent) {

		if (this[$captured] == false) {
			this[$captured] = true
			event.capture()
		}

		return this
	}

	/**
	 * @method reset
	 * @since 0.1.0
	 */
	public reset() {

		this[$state] = State.Allowed
		this[$captured] = false
		this[$resolved] = false
		this[$detected] = -1
		this[$canceled] = -1
		this[$finished] = -1

		this.onReset()

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
	private [$view]: View | null = null

	/**
	 * @property $state
	 * @since 0.1.0
	 * @hidden
	 */
	private [$state]: State = State.Allowed

	/**
	 * @property $captured
	 * @since 0.1.0
	 * @hidden
	 */
	private [$captured]: boolean = false

	/**
	 * @property $resolved
	 * @since 0.1.0
	 * @hidden
	 */
	private [$resolved]: boolean = false

	/**
	 * @property $duration
	 * @since 0.1.0
	 * @hidden
	 */
	private [$duration]: number = -1

	/**
	 * @property $callback
	 * @since 0.1.0
	 * @hidden
	 */
	private [$callback]: GestureDetectorCallback<T>

	/**
	 * @property $detectTime
	 * @since 0.1.0
	 * @hidden
	 */
	private [$detected]: number = 0

	/**
	 * @property $cancelTime
	 * @since 0.1.0
	 * @hidden
	 */
	private [$canceled]: number = 0

	/**
	 * @property $finishTime
	 * @since 0.1.0
	 * @hidden
	 */
	private [$finished]: number = 0
}

/**
 * @const OPTIONS
 * @since 0.1.0
 * @hidden
 */
const OPTIONS: Required<GestureDetectorOptions> = {
	enabled: true,
	capture: false
}

/**
 * The gesture detector callback.
 * @interface GestureDetectorCallback
 * @since 0.1.0
 */
export type GestureDetectorCallback<T> = (gesture: T) => void

/**
 * The gesture detector options.
 * @interface GestureDetectorOptions
 * @since 0.1.0
 */
export interface GestureDetectorOptions {
	enabled?: boolean
	capture?: boolean
}

/**
 * @interface State
 * @since 0.1.0
 */
export enum State {
	Allowed,
	Ignored,
	Detected,
	Updated,
	Canceled,
	Finished
}