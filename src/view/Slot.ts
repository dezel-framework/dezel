import { $children } from 'view/symbol/Slot'
import { $offset } from 'view/symbol/Slot'
import { $parent } from 'view/symbol/Slot'
import { bound } from 'decorator/bound'
import { insertChild } from 'view/private/Slot'
import { insertEntry } from 'view/private/Slot'
import { removeChild } from 'view/private/Slot'
import { removeEntry } from 'view/private/Slot'
import { Body } from '../component/Body'
import { Emitter } from 'event/Emitter'
import { Event } from 'event/Event'
import { Constructor } from 'type/Constructor'
import { JSXProperties } from 'type/JSX'
import { View } from 'view/View'

/**
 * @class Slot
 * @super Emitter
 * @since 0.1.0
 */
export class Slot<T extends View = View> extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The slot's name.
	 * @propety name
	 * @since 0.1.0
	 */
	public name: string = ''

	/**
	 * The slot's main flag.
	 * @propety main
	 * @since 0.1.0
	 */
	public main: boolean = false

	/**
	 * The slot's type of content.
	 * @propety children
	 * @since 0.1.0
	 */
	public type: Constructor<T> | null = null

	/**
	 * The slot's children.
	 * @propety children
	 * @since 0.1.0
	 */
	public get children(): ReadonlyArray<View> {
		return this[$children]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Binds the slot to the specified target.
	 * @method attach
	 * @since 0.1.0
	 */
	public attach(parent: View, offset: number) {

		this[$parent] = parent
		this[$offset] = offset

		this.children.forEach((c, i) => {
			parent.insert(c, i + offset)
		})

		parent.on('insert', this.onParentInsert)
		parent.on('remove', this.onParentRemove)

		return this
	}

	/**
	 * Unbinds the slot from its target.
	 * @method attach
	 * @since 0.1.0
	 */
	public detach(parent: View) {

		if (this[$parent] == null ||
			this[$parent] != parent) {
			return this
		}

		parent.off('insert', this.onParentInsert)
		parent.off('remove', this.onParentRemove)

		this.empty()

		return this
	}

	/**
	 * Returns a item at a specified index.
	 * @method get
	 * @since 0.1.0
	 */
	public get(index: number) {
		return this[$children][index]
	}

	/**
	 * Returns the index of an item.
	 * @method locate
	 * @since 0.1.0
	 */
	public locate(child: View) {
		return this[$children].indexOf(child)
	}

	/**
	 * Appends a view into the slot.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View) {
		return this.insert(child, this.children.length)
	}

	/**
	 * Inserts a view into the slot.
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View, index: number) {

		if (this.type) {
			if (child instanceof this.type == false) {
				throw new Error('Slot does not allow type ' + this.type)
			}
		}

		if (index > this.children.length) {
			index = this.children.length
		} else if (index < 0) {
			index = 0
		}

		insertEntry(this, child, index)
		insertChild(this, child, index)

		this.emit<SlotInsertEvent>('insert', { data: { child, index } })

		return this
	}

	/**
	 * Removes a view from the colection.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View) {

		let index = this.locate(child)
		if (index == -1) {
			return this
		}

		removeEntry(this, child, index)
		removeChild(this, child, index)

		this.emit<SlotRemoveEvent>('remove', { data: { child, index } })

		return this
	}

	/**
	 * Removes all the views from the slot.
	 * @method empty
	 * @since 0.1.0
	 */
	public empty() {

		while (this[$children].length) {
			this.remove(this[$children][0])
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

		}

		super.onEvent(event)
	}

	/**
	 * Called after a view in inserted into the slot.
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

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $view
	 * @since 0.1.0
	 * @hidden
	 */
	private [$parent]: View | Body

	/**
	 * @property $offset
	 * @since 0.1.0
	 * @hidden
	 */
	private [$offset]: number = 0

	/**
	 * @property $children
	 * @since 0.1.0
	 * @hidden
	 */
	private [$children]: Array<View> = []

	/**
	 * @method onParentInsert
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onParentInsert(event: Event<SlotInsertEvent>) {

		let {
			index,
			child
		} = event.data

		/*
		 * This method will be called when we insert our own
		 * view so we need to discard these.
		 */

		if (this.locate(child) > -1) {
			return
		}

		/*
		 * Only increment when the view has been added before the position
		 * of the slot.
		 */

		if (this[$offset] >= index) {
			this[$offset] += 1
		}
	}

	/**
	 * @method onParentRemove
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onParentRemove(event: Event<SlotRemoveEvent>) {

		let {
			index,
			child
		} = event.data

		/*
		 * This method will be called when we insert our own
		 * view so we need to discard these.
		 */

		if (this.locate(child) > -1) {
			return
		}

		/*
		 * Only increment when the view has been removed before the position
		 * of the slot.
		 */

		if (this[$offset] >= index) {
			this[$offset] -= 1
		}
	}

	//--------------------------------------------------------------------------
	// JSX
	//--------------------------------------------------------------------------

	/**
	 * @property __jsxProps
	 * @since 0.1.0
	 * @hidden
	 */
	public __jsxProps: JSXProperties<this>
}

/**
 * The view's insert event data.
 * @type SlotInsertEvent
 * @since 0.1.0
 */
export type SlotInsertEvent = {
	child: View
	index: number
}

/**
 * The view's remove event data.
 * @type SlotRemoveEvent
 * @since 0.1.0
 */
export type SlotRemoveEvent = {
	child: View
	index: number
}