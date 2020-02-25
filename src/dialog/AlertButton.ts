import { bridge } from '../native/bridge'
import { native } from '../native/native'
import { Emitter } from '../event/Emitter'
import { Event } from '../event/Event'

@bridge('dezel.dialog.AlertButton')

/**
 * @class AlertButton
 * @super Emitter
 * @since 0.1.0
 */
export class AlertButton extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The alert button's id.
	 * @property id
	 * @since 0.1.0
	 */
	public id: string

	/**
	 * The alert button's label.
	 * @property label
	 * @since 0.1.0
	 */
	@native public readonly label!: string

	/**
	 * The alert button's image.
	 * @property image
	 * @since 0.1.0
	 */
	@native public readonly image!: string | null

	/**
	 * The alert button's style.
	 * @property style
	 * @since 0.1.0
	 */
	@native public readonly style!: 'normal' | 'cancel' | 'destructive'

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the alert button.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(options: AlertButtonOptions) {

		super()

		let opts = Object.assign(
			{},
			OPTIONS,
			options
		)

		this.id = opts.id
		this.image = opts.image
		this.label = opts.label
		this.style = opts.style
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onEvent
	 * @since 0.1.0
	 */
	onEvent(event: Event) {

		switch (event.type) {

			case 'press':
				this.onPress(event)
				break
		}

		super.onEvent(event)
	}

	/**
	 * Called the alert button is pressed.
	 * @method onPress
	 * @since 0.1.0
	 */
	public onPress(event: Event) {

	}

	//--------------------------------------------------------------------------
	// Native API
	//--------------------------------------------------------------------------

	/**
	 * @method nativeOnPress
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnPress() {
		this.emit('press')
	}
}

/**
 * @const OPTIONS
 * @since 0.1.0
 * @hidden
 */
const OPTIONS: Required<AlertButtonOptions> = {
	id: 'ok',
	label: 'OK',
	image: null,
	style: 'normal'
}

/**
 * @interface AlertButtonOptions
 * @since 0.1.0
 */
export interface AlertButtonOptions {
	id?: string
	label?: string
	image?: string | null
	style?: 'normal' | 'cancel' | 'destructive'
}
