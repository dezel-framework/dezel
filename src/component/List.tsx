import { Dezel } from 'index'
import { $items } from 'component/symbol/List'
import { $selectedEntry } from 'component/symbol/List'
import { $selectedIndex } from 'component/symbol/List'
import { bound } from 'decorator/bound'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { ListItem } from 'component/ListItem'
import { Event } from 'event/Event'
import { Slot } from 'view/Slot'
import './List.style'

/**
 * @class List
 * @super Component
 * @since 0.1.0
 */
export class List extends Component {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * The list's items.
	 * @property items
	 * @since 0.1.0
	 */
	public items: ReadonlyArray<ListItem> = []

	/**
	 * The list's selected index.
	 * @property selectedIndex
	 * @since 0.1.0
	 */
	public get selectedIndex(): number | null {
		return this[$selectedIndex]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inhreited
	 * @method render
	 * @since 0.1.0
	 */
	public render() {
		return (
			<Body>
				<Slot
					main
					type={ListItem}
					onInsert={(c: ListItem, i: number) => this.onInsertItem(c, i)}
					onRemove={(c: ListItem, i: number) => this.onRemoveItem(c, i)}
				/>
			</Body>
		)
	}

	/**
	 * Selects an item at a specified index.
	 * @method select
	 * @since 0.1.0
	 */
	public select(index: number | null) {

		if (index == this.selectedIndex) {
			return this
		}

		let event = new Event<ListBeforeSelectEvent>('beforeselect', {
			cancelable: true,
			propagable: false,
			data: {
				index
			}
		})

		this.emit(event)

		if (event.canceled) {
			return this
		}

		this.clearSelection()

		if (index == null) {
			return this
		}

		this.applySelection(index)

		return this
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * Called before an item is selected.
	 * @method onBeforeSelect
	 * @since 0.1.0
	 */
	public onBeforeSelect(index: number) {

	}

	/**
	 * Called after an item is selected.
	 * @method onSelect
	 * @since 0.1.0
	 */
	public onSelect(index: number) {

	}

	/**
	 * Called after an item is deselected.
	 * @method onDeselect
	 * @since 0.1.0
	 */
	public onDeselect(index: number) {

	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method onInsertItem
	 * @since 0.1.0
	 * @hidden
	 */
	protected onInsertItem(item: ListItem, index: number) {

		this[$items].splice(index, 0, item)

		if (this[$selectedIndex] &&
			this[$selectedIndex]! >= index) {
			this[$selectedIndex]!++
		}

		item.on('press', this.onListItemPress)
	}

	/**
	 * @method onRemoveItem
	 * @since 0.1.0
	 * @hidden
	 */
	protected onRemoveItem(item: ListItem, index: number) {

		this[$items].splice(index, 1)

		item.pressed = false

		if (this[$selectedIndex] &&
			this[$selectedIndex]! > index) {
			this[$selectedIndex]!--
		} else if (this[$selectedIndex] == index) {
			this[$selectedIndex] = null
			this[$selectedEntry] = null
			item.selected = false
		}

		item.off('press', this.onListItemPress)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $items
	 * @since 0.1.0
	 * @hidden
	 */
	private [$items]: Array<ListItem> = []

	/**
	 * @property $selectedIndex
	 * @since 0.1.0
	 * @hidden
	 */
	private [$selectedIndex]: number | null = null

	/**
	 * @property $selectedEntry
	 * @since 0.1.0
	 * @hidden
	 */
	private [$selectedEntry]: ListItem | null = null

	/**
	 * @method applySelection
	 * @since 0.1.0
	 * @hidden
	 */
	private applySelection(index: number) {

		let entry = this.items[index]
		if (entry == null) {
			return this
		}

		if (entry instanceof ListItem) {

			entry.selected = true

			this[$selectedIndex] = index
			this[$selectedEntry] = entry

			this.emit<ListSelectEvent>('select', { data: { index } })
		}

		return this
	}

	/**
	 * @method clearSelection
	 * @since 0.1.0
	 * @hidden
	 */
	private clearSelection() {

		let index = this[$selectedIndex]
		let entry = this[$selectedEntry]

		if (entry == null ||
			index == null) {
			return this
		}

		entry.selected = false

		this[$selectedIndex] = null
		this[$selectedEntry] = null

		this.emit<ListDeselectEvent>('deselect', { data: { index } })

		return this
	}

	/**
	 * @method onListItemPress
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onListItemPress(event: Event) {
		this.select(this.items.indexOf(event.sender as ListItem))
	}
}

/**
 * @type ListBeforeSelectEvent
 * @since 0.1.0
 */
export type ListBeforeSelectEvent = {
	index: number | null
}

/**
 * @type ListSelectEvent
 * @since 0.1.0
 */
export type ListSelectEvent = {
	index: number
}

/**
 * @type ListDeselectEvent
 * @since 0.1.0
 */
export type ListDeselectEvent = {
	index: number
}