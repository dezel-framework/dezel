import { bridge } from 'native/bridge'
import { native } from 'native/native'

@bridge('dezel.locale.Locale')

/**
 * @class Locale
 * @since 0.1.0
 */
export class Locale {

	//--------------------------------------------------------------------------
	// Static
	//--------------------------------------------------------------------------

	/**
	 * The current locale.
	 * @property current
	 * @since 0.1.0
	 */
	public static get current(): Locale {

		if (current == null) {
			current = new Locale()
		}

		return current
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The locale's language code.
	 * @property language
	 * @since 0.1.0
	 */
	@native public readonly language!: string

	/**
	 * The locale's region code.
	 * @property region
	 * @since 0.1.0
	 */
	@native public readonly region!: string

	/**
	 * Whether the locale is left-to-right.
	 * @property ltr
	 * @since 0.1.0
	 */
	@native public readonly ltr!: boolean

	/**
	 * Whether the locale is right-to-left.
	 * @property rtl
	 * @since 0.1.0
	 */
	@native public readonly rtl!: boolean
}

/**
 * @const current
 * @since 0.1.0
 * @hidden
 */
let current: Locale | null = null