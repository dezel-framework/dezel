import { bridge } from 'native/bridge'
import { native } from 'native/native'

@bridge('dezel.device.Device')

/**
 * @class Device
 * @since 0.1.0
 */
export class Device {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * The current device.
	 * @property current
	 * @since 0.1.0
	 */
	public static get current(): Device {

		if (current == null) {
			current = new Device()
		}

		return current
	}

	//--------------------------------------------------------------------------
	// Property
	//--------------------------------------------------------------------------

	/**
	 * The device unique identifier.
	 * @property uuid
	 * @since 0.1.0
	 */
	public get uuid(): string {
		return native(this).uuid
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Plays a sound.
	 * @method sound
	 * @since 0.1.0
	 */
	public sound(id: string) {
		native(this).sound(id)
		return this
	}

	/**
	 * Plays a vibration.
	 * @method vibrate
	 * @since 0.1.0
	 */
	public vibrate(id: string) {
		native(this).vibrate(id)
		return this
	}
}

/**
 * @const current
 * @since 0.1.0
 */
let current: Device | null = null