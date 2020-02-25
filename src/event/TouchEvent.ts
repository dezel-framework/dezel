import { $canceled } from './symbol/Touch'
import { $captured } from './symbol/Touch'
import { $activeTouches } from './symbol/TouchEvent'
import { $targetTouches } from './symbol/TouchEvent'
import { $touches } from './symbol/TouchEvent'
import { Event } from '../event/Event'
import { EventOptions } from '../event/Event'
import { View } from '../view/View'
import { TouchList } from './TouchList'

/**
 * @class TouchEvent
 * @super Event
 * @since 0.1.0
 */
export class TouchEvent extends Event<any> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The touch event's touches.
	 * @property touches
	 * @since 0.1.0
	 */
	public get touches(): TouchList {
		return this[$touches]
	}

	/**
	 * The touch event's active touches.
	 * @property activeTouches
	 * @since 0.1.0
	 */
	public get activeTouches(): TouchList {
		return this[$activeTouches]
	}

	/**
	 * The touch event's target touches.
	 * @property targetTouches
	 * @since 0.1.0
	 */
	public get targetTouches(): TouchList {
		return this[$targetTouches]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the touch event.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(type: string, options: TouchEventOptions) {
		super(type, options)
		this[$touches] = options.touches
		this[$activeTouches] = options.activeTouches
		this[$targetTouches] = options.targetTouches
	}

	/**
	 * @inherited
	 * @method onCancel
	 * @since 0.1.0
	 */
	public onCancel() {
		for (let touch of this.touches) {
			touch[$canceled] = true
		}
	}

	/**
	 * @inherited
	 * @method onCapture
	 * @since 0.1.0
	 */
	public onCapture() {
		for (let touch of this.touches) {
			touch[$captured] = true
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $touches
	 * @since 0.1.0
	 * @hidden
	 */
	private [$touches]: TouchList

	/**
	 * @property $activeTouches
	 * @since 0.1.0
	 * @hidden
	 */
	private [$activeTouches]: TouchList

	/**
	 * @property $targetTouches
	 * @since 0.1.0
	 * @hidden
	 */
	private [$targetTouches]: TouchList
}

/**
 * The touch event options.
 * @interface TouchEventOptions
 * @since 0.1.0
 */
export interface TouchEventOptions extends EventOptions {
	touches: TouchList
	activeTouches: TouchList
	targetTouches: TouchList
}