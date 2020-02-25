import { $children } from './symbol/Fragment'
import { insertItem } from './private/Fragment'
import { removeItem } from './private/Fragment'
import { View } from '../view/View'
import { Collection } from './Collection'

/**
 * @class Fragment
 * @since 0.1.0
 */
export class Fragment {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The fragment's children.
	 * @property children
	 * @since 0.1.0
	 */
	public get children(): ReadonlyArray<View | Collection> {
		return this[$children]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Appends a child view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View | Collection) {
		this.insert(child, this.children.length)
		return this
	}

	/**
	 * Inserts a child view at a specified index.
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View | Collection, index: number) {

		if (child instanceof View) {
			if (child.parent) {
				child.parent.remove(child)
			}
		}

		if (index > this.children.length) {
			index = this.children.length
		} else if (index < 0) {
			index = 0
		}

		insertItem(this, child, index)

		return this
	}

	/**
	 * Inserts a child view before another.
	 * @method insertBefore
	 * @since 0.1.0
	 */
	public insertBefore(child: View, before: View) {

		let index = this.children.indexOf(before)
		if (index == -1) {
			return this
		}

		this.insert(child, index)

		return this
	}

	/**
	 * Inserts a child view after another.
	 * @method insertAfter
	 * @since 0.1.0
	 */
	public insertAfter(child: View, after: View) {

		let index = this.children.indexOf(after)
		if (index == -1) {
			return this
		}

		this.insert(child, index + 1)

		return this
	}

	/**
	 * Replace a child view with another.
	 * @method replace
	 * @since 0.1.0
	 */
	public replace(child: View, using: View) {

		let index = this.children.indexOf(child)
		if (index == -1) {
			return this
		}

		this.remove(child)
		this.insert(using, index)

		return this
	}

	/**
	 * Removes a child view with another.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View | Collection) {

		let index = this.children.indexOf(child)
		if (index == -1) {
			return this
		}

		removeItem(this, child, index)

		return this
	}

	/**
	 * Remove all child views.
	 * @method removeAll
	 * @since 0.1.0
	 */
	public removeAll() {

		while (this.children.length) {
			this.remove(this.children[0])
		}

		return this
	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method appendTo
	 * @since 0.1.0
	 * @hidden
	 */
	public appendTo(target: View | Collection, offset: number) {

		this.children.forEach((c, i) => {
			target.insert(c, i + offset)
		})

		return this
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $children
	 * @since 0.1.0
	 * @hidden
	 */
	private [$children]: Array<View | Collection> = []
}