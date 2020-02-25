import { $canceled } from './symbol/Touch'
import { $captured } from './symbol/Touch'
import { $id } from './symbol/Touch'
import { $target } from './symbol/Touch'
import { $x } from './symbol/Touch'
import { $y } from './symbol/Touch'
import { View } from '../view/View'

/**
 * @class Touch
 * @since 0.1.0
 */
export class Touch {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The touch's coordinate on the x axis.
	 * @property x
	 * @since 0.1.0
	 */
	public get x(): number {
		return this[$x]
	}

	/**
	 * The touch's coordinate on the y axis.
	 * @property y
	 * @since 0.1.0
	 */
	public get y(): number {
		return this[$y]
	}

	/**
	 * The touch's unique identifier.
	 * @property id
	 * @since 0.1.0
	 */
	public get id(): number {
		return this[$id]
	}

	/**
	 * The touch's target.
	 * @property target
	 * @since 0.1.0
	 */
	public get target(): View {
		return this[$target]
	}

	/**
	 * Whether the touch is captured.
	 * @property captured
	 * @since 0.1.0
	 */
	public get captured(): boolean {
		return this[$captured]
	}

	/**
	 * Whether the touch is canceled.
	 * @property canceled
	 * @since 0.1.0
	 */
	public get canceled(): boolean {
		return this[$canceled]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the touch.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(target: View) {
		this[$target] = target
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $x
	 * @since 0.1.0
	 * @hidden
	 */
	private [$x]: number = 0

	/**
	 * @property $y
	 * @since 0.1.0
	 * @hidden
	 */
	private [$y]: number = 0

	/**
	 * @property $id
	 * @since 0.1.0
	 * @hidden
	 */
	private [$id]: number = 0

	/**
	 * @property $target
	 * @since 0.1.0
	 * @hidden
	 */
	private [$target]: View

	/**
	 * @property $canceled
	 * @since 0.1.0
	 * @hidden
	 */
	private [$canceled]: boolean = false

	/**
	 * @property $captured
	 * @since 0.1.0
	 * @hidden
	 */
	private [$captured]: boolean = false
}
