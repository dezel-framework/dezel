import { $detectX } from 'gesture/symbol/PanGestureDetector'
import { $detectY } from 'gesture/symbol/PanGestureDetector'
import { $originX } from 'gesture/symbol/PanGestureDetector'
import { $originY } from 'gesture/symbol/PanGestureDetector'
import { $touch } from 'gesture/symbol/PanGestureDetector'
import { $translationX } from 'gesture/symbol/PanGestureDetector'
import { $translationY } from 'gesture/symbol/PanGestureDetector'
import { $x } from 'gesture/symbol/PanGestureDetector'
import { $y } from 'gesture/symbol/PanGestureDetector'
import { Touch } from 'event/Touch'
import { TouchEvent } from 'event/TouchEvent'
import { GestureDetector } from 'gesture/GestureDetector'
import { State } from 'gesture/GestureDetector'

/**
 * @class PanGestureDetector
 * @super GestureDetector
 * @since 0.1.0
 */
export class PanGestureDetector extends GestureDetector<PanGestureDetector> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The pointer position on the x axis.
	 * @property x
	 * @since 0.1.0
	 */
	public get x(): number {
		return this[$x]
	}

	/**
	 * The pointer position on the y axis.
	 * @property y
	 * @since 0.1.0
	 */
	public get y(): number {
		return this[$y]
	}

	/**
	 * The pointer position on the x axis when the gesture started.
	 * @property originX
	 * @since 0.1.0
	 */
	public get originX(): number {
		return this[$originX]
	}

	/**
	 * The pointer position on the y axis when the gesture started.
	 * @property originY
	 * @since 0.1.0
	 */
	public get originY(): number {
		return this[$originY]
	}

	/**
	 * The pointer translation on the x axis.
	 * @property translationX
	 * @since 0.1.0
	 */
	public get translationX(): number {
		return this[$translationX]
	}

	/**
	 * The pointer translation on the y axis.
	 * @property translationY
	 * @since 0.1.0
	 */
	public get translationY(): number {
		return this[$translationX]
	}

	/**
	 * The minimum amount of translation to detect the gesture.
	 * @property threshold
	 * @since 0.1.0
	 */
	public threshold: number = 10

	/**
	 * The gesture direction to detect.
	 * @property direction
	 * @since 0.1.0
	 */
	public direction: 'vertical' | 'horizontal' | 'both' = 'horizontal'

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onTouchStart
	 * @since 0.1.0
	 */
	public onTouchStart(event: TouchEvent) {
		if (this[$touch] == null) {
			this[$touch] = event.touches.get(0)
			this[$originX] = event.touches.get(0).x
			this[$originY] = event.touches.get(0).y
		}
	}

	/**
	 * @inherited
	 * @method onTouchMove
	 * @since 0.1.0
	 */
	public onTouchMove(event: TouchEvent) {

		let touch = this[$touch]
		if (touch == null) {
			return
		}

		if (event.touches.has(touch) == false) {
			return
		}

		let dh = this.direction == 'both' || this.direction == 'horizontal'
		let dv = this.direction == 'both' || this.direction == 'vertical'

		if (this.state == State.Allowed) {

			let x = touch.x - this[$originX]
			let y = touch.y - this[$originY]

			let mx = Math.abs(x) > this.threshold && dh
			let my = Math.abs(y) > this.threshold && dv

			if (mx) this[$detectX] = touch.x
			if (my) this[$detectY] = touch.y

			if (mx || my) {
				this.detect()
			}

		} else if (this.state == State.Detected || this.state == State.Updated) {

			this[$x] = touch.x
			this[$y] = touch.y
			this[$translationX] = touch.x - this[$detectX]
			this[$translationY] = touch.y - this[$detectY]

			this.update()
		}
	}

	/**
	 * @inherited
	 * @method onTouchEnd
	 * @since 0.1.0
	 */
	public onTouchEnd(event: TouchEvent) {

		let touch = this[$touch]
		if (touch == null) {
			return
		}

		if (event.touches.has(touch) == false) {
			return
		}

		if (this.state == State.Detected ||
			this.state == State.Updated) {
			this.finish()
		}
	}

	/**
	 * @inherited
	 * @method onTouchCancel
	 * @since 0.1.0
	 */
	public onTouchCancel(event: TouchEvent) {

		let touch = this[$touch]
		if (touch == null) {
			return
		}

		if (event.touches.has(touch) == false) {
			return
		}

		if (this.state == State.Detected ||
			this.state == State.Updated) {
			this.finish()
		}
	}

	/**
	 * @inherited
	 * @method onTouchCancel
	 * @since 0.1.0
	 */
	public onReset() {
		this[$x] = -1
		this[$y] = -1
		this[$originX] = -1
		this[$originX] = -1
		this[$detectX] = -1
		this[$detectY] = -1
		this[$translationX] = -1
		this[$translationY] = -1
		this[$touch] = null
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $touch
	 * @since 0.1.0
	 * @hidden
	 */
	private [$touch]: Touch | null = null

	/**
	 * @property $x
	 * @since 0.1.0
	 * @hidden
	 */
	private [$x]: number = -1

	/**
	 * @property $y
	 * @since 0.1.0
	 * @hidden
	 */
	private [$y]: number = -1

	/**
	 * @property $originX
	 * @since 0.1.0
	 * @hidden
	 */
	private [$originX]: number = -1

	/**
	 * @property $originY
	 * @since 0.1.0
	 * @hidden
	 */
	private [$originY]: number = -1

	/**
	 * @property $detectX
	 * @since 0.1.0
	 * @hidden
	 */
	private [$detectX]: number = -1

	/**
	 * @property $detectY
	 * @since 0.1.0
	 * @hidden
	 */
	private [$detectY]: number = -1

	/**
	 * @property $translationX
	 * @since 0.1.0
	 * @hidden
	 */
	private [$translationX]: number = -1

	/**
	 * @property $translationY
	 * @since 0.1.0
	 * @hidden
	 */
	private [$translationY]: number = -1

}
