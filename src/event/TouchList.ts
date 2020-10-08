import { iterator } from 'iterator'
import { $touches } from 'event/symbol/TouchList'
import { Touch } from 'event/Touch'

/**
 * @class TouchList
 * @since 0.1.0
 */
export class TouchList implements Iterable<Touch> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The touch list's length.
	 * @property length
	 * @since 0.1.0
	 */
	public get length(): number {
		return this[$touches].length
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 * @hidden
	 */
	constructor(touches: Array<Touch>) {
		this[$touches] = touches
	}

	/**
	 * Returns a touch.
	 * @method get
	 * @since 0.1.0
	 */
	public get(index: number) {
		return this[$touches][index]
	}

	/**
	 * Indicates whether the list has a touch.
	 * @method has
	 * @since 0.1.0
	 */
	public has(touch: Touch) {
		return this[$touches].includes(touch)
	}

	/**
	 * Indicates whether every touches match the predicate.
	 * @method every
	 * @since 0.1.0
	 */
	public every(callback: TouchListCallback) {
		return this[$touches].every(callback)
	}

	/**
	 * indicates whether some touches matches the predicate.
	 * @method some
	 * @since 0.1.0
	 */
	public some(callback: TouchListCallback) {
		return this[$touches].some(callback)
	}

	/**
	 * Executes the callback on each touches of the list.
	 * @method each
	 * @since 0.1.0
	 */
	public each(callback: TouchListCallback) {
		return this[$touches].forEach(callback)
	}

	//--------------------------------------------------------------------------
	// Symbols
	//--------------------------------------------------------------------------

	/**
	 * @property [Symbol.iterator]
	 * @since 0.1.0
	 */
	public [Symbol.iterator]() {
		return iterator<Touch>(this[$touches])
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $touches
	 * @since 0.1.0
	 * @hidden
	 */
	private [$touches]: Array<Touch> = []
}

/**
 * @type TouchListCallback
 * @since 0.1.0
 */
export type TouchListCallback = (touch: Touch, index: number, array: ReadonlyArray<Touch>) => boolean