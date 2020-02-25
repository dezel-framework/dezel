import { $listeners } from './symbol/Emitter'
import { $responder } from './symbol/Emitter'
import { $sender } from './symbol/Event'
import { $target } from './symbol/Event'
import { dispatchEvent } from './private/Emitter'
import { insertListener } from './private/Emitter'
import { removeListener } from './private/Emitter'
import { Event } from './Event'
import { EventListener } from './Event'
import { EventListeners } from './Event'
import { EventOptions } from './Event'

/**
 * @class Emitter
 * @since 0.1.0
 */
export class Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The emitter's next responder.
	 * @property responder
	 * @since 0.1.0
	 */
	public get responder(): Emitter | null {
		return this[$responder]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Destroys the emitter.
	 * @method destroy
	 * @since 0.1.0
	 */
	public destroy() {
		this[$responder] = null
		this[$listeners] = {}
		return this
	}

	/**
	 * Attach an event handler.
	 * @method on
	 * @since 0.1.0
	 */
	public on(type: string, listener: EventListener) {
		insertListener(this, type, listener as any)
		return this
	}

	/**
	 * Attach an event handler that run only once.
	 * @method once
	 * @since 0.1.0
	 */
	public once(type: string, listener: EventListener) {
		insertListener(this, type, listener, true)
		return this
	}

	/**
	 * Detach an event handler.
	 * @method off
	 * @since 0.1.0
	 */
	public off(type: string, listener: EventListener) {
		removeListener(this, type, listener)
		return this
	}

	/**
	 * Emits an event.
	 * @method emit
	 * @since 0.1.0
	 */
	public emit<T extends any = any>(event: Event | string, options: EventOptions<T> = {}) {

		if (typeof event == 'string') {
			event = new Event<T>(event, options)
		}

		event[$target] = this
		event[$sender] = this

		dispatchEvent(this, event)

		return this
	}

	/**
	 * Called when an event is received.
	 * @method onEvent
	 * @since 0.1.0
	 */
	public onEvent(event: Event) {

	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $responder
	 * @since 0.1.0
	 * @hidden
	 */
	private [$responder]: Emitter | null = null

	/**
	 * @property $listeners
	 * @since 0.1.0
	 * @hidden
	 */
	private [$listeners]: Dictionary<EventListeners> = {}
}
