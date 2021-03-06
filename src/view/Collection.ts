import { bound } from 'decorator/bound'
import { Emitter } from 'event/Emitter'
import { Event } from 'event/Event'
import { $items } from 'view/symbol/Collection'
import { $length } from 'view/symbol/Collection'
import { $offset } from 'view/symbol/Collection'
import { $target } from 'view/symbol/Collection'
import { insertItem } from 'view/private/Collection'
import { insertView } from 'view/private/Collection'
import { removeItem } from 'view/private/Collection'
import { removeView } from 'view/private/Collection'
import { Fragment } from 'view/Fragment'
import { View } from 'view/View'
import { ViewInsertEvent } from 'view/View'
import { ViewMoveToParentEvent } from 'view/View'
import { ViewRemoveEvent } from 'view/View'

/**
 * @class Collection
 * @super Emitter
 * @since 0.1.0
 */
export class Collection extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The collection's length.
	 * @propety length
	 * @since 0.1.0
	 */
	public get length(): number {
		return this[$length]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Destroys the collection and removes its views.
	 * @method destroy
	 * @since 0.1.0
	 */
	public destroy() {

		if (this[$target]) {
			this[$target].off('insert', this.onViewInsert)
			this[$target].off('remove', this.onViewRemove)
			this[$target].off('destroy', this.onViewDestroy)
		}

		this.removeAll()

		this.emit<ViewMoveToParentEvent>('movetoparent', { data: { parent: null, former: this[$target] } })

		return super.destroy()
	}

	/**
	 * Returns a item at a specified index.
	 * @method get
	 * @since 0.1.0
	 */
	public get(index: number) {
		return this[$items][index]
	}

	/**
	 * Returns the index of an item.
	 * @method index
	 * @since 0.1.0
	 */
	public index(child: View) {
		return this[$items].indexOf(child)
	}

	/**
	 * Appends a view into the collection.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View | Fragment) {
		return this.insert(child, this.length)
	}

	/**
	 * Inserts a view into the collection.
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View | Fragment | Collection, index: number) {

		if (child instanceof Fragment) {
			child.appendTo(this, index)
			return this
		}

		if (child instanceof Collection) {
			throw new Error('Collection does not support nested collection')
			return this
		}

		if (index > this.length) {
			index = this.length
		} else if (index < 0) {
			index = 0
		}

		this[$length]++

		insertItem(this, child, index)
		insertView(this, child, index)

		this.emit<ViewInsertEvent>('insert', { data: { child, index } })

		return this
	}

	/**
	 * Removes a view from the colection.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View) {

		let index = this.index(child)
		if (index == -1) {
			return this
		}

		this[$length]--

		removeItem(this, child, index)
		removeView(this, child, index)

		this.emit<ViewRemoveEvent>('remove', { data: { child, index } })

		return this
	}

	/**
	 * Removes all the views from the collection.
	 * @method removeAll
	 * @since 0.1.0
	 */
	public removeAll() {

		while (this[$items].length) {
			this.remove(this[$items][0])
		}

		return this
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method onEvent
	 * @since 0.1.0
	 */
	public onEvent(event: Event) {

		switch (event.type) {

			case 'insert':
				this.onInsert(event.data.child, event.data.index)
				break

			case 'remove':
				this.onRemove(event.data.child, event.data.index)
				break

			case 'movetoparent':
				this.onMoveToParent(event.data.parent, event.data.former)
				break
		}

		super.onEvent(event)
	}

	/**
	 * Called after a view in inserted into the collection.
	 * @method onInsert
	 * @since 0.1.0
	 */
	public onInsert(child: View, index: number) {

	}

	/**
	 * Called after a view is removed from the collction.
	 * @method onRemove
	 * @since 0.1.0
	 */
	public onRemove(child: View, index: number) {

	}

	/**
	 * Called when the collection is bound to a parent.
	 * @method onAttach
	 * @since 0.1.0
	 */
	public onMoveToParent(parent: View | null, former: View | null) {

	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method appendTo
	 * @since 0.1.0
	 * @hidden
	 */
	public appendTo(target: View, offset: number) {

		this[$target] = target
		this[$offset] = offset

		this[$items].forEach((c, i) => {
			target.insert(c, i + offset)
		})

		target.on('insert', this.onViewInsert)
		target.on('remove', this.onViewRemove)
		target.on('destroy', this.onViewDestroy)

		this.emit<ViewMoveToParentEvent>('movetoparent', { data: { parent: this[$target], former: null } })

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
	private [$target]: View

	/**
	 * @property $offset
	 * @since 0.1.0
	 * @hidden
	 */
	private [$offset]: number = 0

	/**
	 * @property $length
	 * @since 0.1.0
	 * @hidden
	 */
	private [$length]: number = 0

	/**
	 * @property $items
	 * @since 0.1.0
	 * @hidden
	 */
	private [$items]: Array<View> = []

	/**
	 * @method onViewInsert
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onViewInsert(event: Event<ViewInsertEvent>) {

		let {
			index,
			child
		} = event.data

		/*
		 * This method will be called when we insert our own
		 * view so we need to discard these.
		 */

		if (this.index(child) > -1) {
			return
		}

		/*
		 * Only increment when the view has been added before the position
		 * of the collection.
		 */

		if (this[$offset] >= index) {
			this[$offset] += 1
		}
	}

	/**
	 * @method onViewRemove
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onViewRemove(event: Event<ViewRemoveEvent>) {

		let {
			index,
			child
		} = event.data

		/*
		 * This method will be called when we insert our own
		 * view so we need to discard these.
		 */

		if (this.index(child) > -1) {
			return
		}

		/*
		 * Only increment when the view has been removed before the position
		 * of the collection.
		 */

		if (this[$offset] >= index) {
			this[$offset] -= 1
		}
	}

	/**
	 * @method onViewDestroy
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onViewDestroy(event: Event) {
		this.destroy()
	}

	//--------------------------------------------------------------------------
	// JSX
	//--------------------------------------------------------------------------

	/**
	 * @property __jsxProps
	 * @since 0.1.0
	 * @hidden
	 */
	public __jsxProps: any
}
