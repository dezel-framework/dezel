import { $list } from 'view/symbol/StyleList'
import { $view } from 'view/symbol/StyleList'
import { native } from 'native/native'
import { append } from 'util/array'
import { locate } from 'util/array'
import { remove } from 'util/array'
import { toggle } from 'util/array'
import { View } from 'view/View'

/**
 * @class StyleList
 * @since 0.1.0
 */
export class StyleList {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The view managed by the style list.
	 * @property view
	 * @since 0.1.0
	 */
	public get view(): View {
		return this[$view]
	}

	/**
	 * The list of styles.
	 * @property list
	 * @since 0.1.0
	 */
	public get list(): ReadonlyArray<string> {
		return this[$list]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the style list.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(view: View) {
		this[$view] = view
	}

	/**
	 * Indicates whether the view has a style.
	 * @method has
	 * @since 0.1.0
	 */
	public has(style: string): boolean {
		return locate(this.list, style) != null
	}

	/**
	 * Appends a style to the view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(style: string) {
		append(this.list, style)
		native(this.view).appendStyle(style)
		return this
	}

	/**
	 * Removes a style from the view.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(style: string) {
		remove(this.list, style)
		native(this.view).removeStyle(style)
		return this
	}

	/**
	 * Toggles a style from the view.
	 * @method toggle
	 * @since 0.1.0
	 */
	public toggle(style: string) {
		toggle(this.list, style)
		native(this.view).toggleStyle(style)
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
	private [$view]: View

	/**
	 * @property $list
	 * @since 0.1.0
	 * @hidden
	 */
	private [$list]: Array<string> = []
}