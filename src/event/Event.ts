import { $cancelable } from 'event/symbol/Event'
import { $canceled } from 'event/symbol/Event'
import { $capturable } from 'event/symbol/Event'
import { $captured } from 'event/symbol/Event'
import { $data } from 'event/symbol/Event'
import { $propagable } from 'event/symbol/Event'
import { $sender } from 'event/symbol/Event'
import { $target } from 'event/symbol/Event'
import { $type } from 'event/symbol/Event'
import { Emitter } from 'event/Emitter'

/**
 * @class Event
 * @since 0.1.0
 */
export class Event<T extends any = any> {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The event's type.
	 * @property type
	 * @since 0.1.0
	 */
	public get type(): string {
		return this[$type]
	}

	/**
	 * Whether the event is propagale.
	 * @property propagable
	 * @since 0.1.0
	 */
	public get propagable(): boolean {
		return this[$propagable]
	}

	/**
	 * Whether the event is capturable.
	 * @property capturable
	 * @since 0.1.0
	 */
	public get capturable(): boolean {
		return this[$capturable]
	}

	/**
	 * Whether the event is cancelable.
	 * @property cancelable
	 * @since 0.1.0
	 */
	public get cancelable(): boolean {
		return this[$cancelable]
	}

	/**
	 * Whether the event has been captured.
	 * @property captured
	 * @since 0.1.0
	 */
	public get captured(): boolean {
		return this[$captured]
	}

	/**
	 * Whether the event has been canceled.
	 * @property canceled
	 * @since 0.1.0
	 */
	public get canceled(): boolean {
		return this[$canceled]
	}

	/**
	 * The event's target.
	 * @property target
	 * @since 0.1.0
	 */
	public get target(): Emitter {
		return this[$target]!
	}

	/**
	 * The event's sender.
	 * @property sender
	 * @since 0.1.0
	 */
	public get sender(): Emitter {
		return this[$sender]!
	}

	/**
	 * The event's data.
	 * @property data
	 * @since 0.1.0
	 */
	public get data(): T {
		return this[$data]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the event.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(type: string, options: EventOptions<T> = {}) {

		let opts = {
			...OPTIONS,
			...options
		}

		this[$type] = type.toLowerCase()
		this[$data] = opts.data
		this[$propagable] = opts.propagable
		this[$capturable] = opts.capturable
		this[$cancelable] = opts.cancelable
	}

	/**
	 * Captures the event.
	 * @method capture
	 * @since 0.1.0
	 */
	public capture() {

		if (this.capturable == false) {
			throw new Error(`Event error: This event cannot be captured because it is not capturable.`)
		}

		if (this.captured ||
			this.canceled) {
			return this
		}

		this[$captured] = true

		this.onCapture()

		return this
	}

	/**
	 * Cancels the event.
	 * @method cancel
	 * @since 0.1.0
	 */
	public cancel() {

		if (this.cancelable == false) {
			throw new Error(`Event error: This event cannot be canceled because it is not cancelable.`)
		}

		if (this.canceled) {
			return this
		}

		this[$canceled] = true

		this.onCancel()

		return this
	}

	/**
	 * Called when the event is canceled.
	 * @method onCancel
	 * @since 0.1.0
	 */
	public onCancel() {

	}

	/**
	 * Called when the event is captured.
	 * @method onCapture
	 * @since 0.1.0
	 */
	public onCapture() {

	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $type
	 * @since 0.1.0
	 * @hidden
	 */
	private [$type]: string

	/**
	 * @property $propagable
	 * @since 0.1.0
	 * @hidden
	 */
	private [$propagable]: boolean = false

	/**
	 * @property $cancelable
	 * @since 0.1.0
	 * @hidden
	 */
	private [$cancelable]: boolean = false

	/**
	 * @property $capturable
	 * @since 0.1.0
	 * @hidden
	 */
	private [$capturable]: boolean = false

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

	/**
	 * @property $target
	 * @since 0.1.0
	 * @hidden
	 */
	private [$target]: Emitter | null = null

	/**
	 * @property $sender
	 * @since 0.1.0
	 * @hidden
	 */
	private [$sender]: Emitter | null = null

	/**
	 * @property $data
	 * @since 0.1.0
	 * @hidden
	 */
	private [$data]: T
}

/**
 * @const OPTIONS
 * @since 0.9.0
 */
const OPTIONS: Required<EventOptions> = {
	propagable: false,
	cancelable: false,
	capturable: false,
	data: {} as any
}

/**
 * @interface EventOptions
 * @since 0.1.0
 */
export interface EventOptions<T extends any = any> {
	propagable?: boolean
	cancelable?: boolean
	capturable?: boolean
	data?: T
}

/**
 * @type EventListener
 * @since 0.1.0
 */
export type EventListener = (event: any) => void

/**
 * @type EventListeners
 * @since 0.1.0
 */
export type EventListeners = Array<EventListener>