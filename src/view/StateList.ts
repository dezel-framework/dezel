import { $list } from 'view/symbol/StateList'
import { $view } from 'view/symbol/StateList'
import { native } from 'native/native'
import { append } from 'util/array'
import { locate } from 'util/array'
import { remove } from 'util/array'
import { toggle } from 'util/array'
import { View } from 'view/View'

/**
 * @class StateList
 * @since 0.1.0
 */
export class StateList {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The view managed by this state list.
	 * @property view
	 * @since 0.1.0
	 */
	public get view(): View {
		return this[$view]
	}

	/**
	 * The list of states.
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
	 * Initializes the state list.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(view: View) {
		this[$view] = view
	}

	/**
	 * Indicates whether the view has a state.
	 * @method has
	 * @since 0.1.0
	 */
	public has(state: string): boolean {
		return locate(this.list, state) != null
	}

	/**
	 * Appends a state to the view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(state: string) {
		append(this.list, state)
		native(this.view).appendState(state)
		return this
	}

	/**
	 * Removes a state from the view.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(state: string) {
		remove(this.list, state)
		native(this.view).removeState(state)
		return this
	}

	/**
	 * Toggles a state from the view.
	 * @method toggle
	 * @since 0.1.0
	 */
	public toggle(state: string) {
		toggle(this.list, state)
		native(this.view).toggleState(state)
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