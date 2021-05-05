import { Dezel } from 'index'
import { $buttons } from 'component/symbol/TabBar'
import { $selectedEntry } from 'component/symbol/TabBar'
import { $selectedIndex } from 'component/symbol/TabBar'
import { bound } from 'decorator/bound'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { TabBarButton } from 'component/TabBarButton'
import { Event } from 'event/Event'
import { Slot } from 'view/Slot'
import './TabBar.style'

/**
 * @class TabBar
 * @super Component
 * @since 0.1.0
 */
export class TabBar extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The tab bar's buttons.
	 * @property buttons
	 * @since 0.1.0
	 */
	public get buttons(): ReadonlyArray<TabBarButton> {
		return this[$buttons]
	}

	/**
	 * The tab bar's selected index.
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
	 * @inherited
	 * @method render
	 * @since 0.1.0
	 */
	public render() {
		return (
			<Body>
				<Slot
					main
					type={TabBarButton}
					onInsert={(c: TabBarButton, i: number) => this.onInsertButton(c, i)}
					onRemove={(c: TabBarButton, i: number) => this.onRemoveButton(c, i)}
				/>
			</Body>
		)
	}

	/**
	 * Selects a button at a specified index.
	 * @method select
	 * @since 0.1.0
	 */
	public select(index: number | null) {

		if (index == this.selectedIndex) {
			return this
		}

		let event = new Event<TabBarBeforeSelectEvent>('beforeselect', {
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
	 * @inherited
	 * @method onEvent
	 * @since 0.1.0
	 */
	public onEvent(event: Event) {

		switch (event.type) {

			case 'beforeselect':
				this.onBeforeSelect(event.data.index)
				break

			case 'select':
				this.onSelect(event.data.index)
				break

			case 'deselect':
				this.onDeselect(event.data.index)
				break
		}

		super.onEvent(event)
	}

	/**
	 * Called before a button is selected.
	 * @method onBeforeSelect
	 * @since 0.1.0
	 */
	public onBeforeSelect(index: number) {

	}

	/**
	 * Called after a button is selected.
	 * @method onSelect
	 * @since 0.1.0
	 */
	public onSelect(index: number) {

	}

	/**
	 * Called after a button is deselected.
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
	public onInsertButton(button: TabBarButton, index: number) {

		this[$buttons].splice(index, 0, button)

		if (this[$selectedIndex] &&
			this[$selectedIndex]! >= index) {
			this[$selectedIndex]!++
		}

		button.on('press', this.onTabBarButtonPress)
	}

	/**
	 * @method onRemoveButton
	 * @since 0.1.0
	 * @hidden
	 */
	public onRemoveButton(button: TabBarButton, index: number) {

		this[$buttons].splice(index, 1)

		button.pressed = false

		if (this[$selectedIndex] &&
			this[$selectedIndex]! > index) {
			this[$selectedIndex]!--
		} else if (this[$selectedIndex] == index) {
			this[$selectedIndex] = null
			this[$selectedEntry] = null
			button.selected = false
		}

		button.off('press', this.onTabBarButtonPress)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $selectedEntry
	 * @since 0.1.0
	 * @hidden
	 */
	private [$buttons]: Array<TabBarButton> = []

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
	private [$selectedEntry]: TabBarButton | null = null

	/**
	 * @method applySelection
	 * @since 0.1.0
	 * @hidden
	 */
	private applySelection(index: number) {

		let entry = this.buttons[index]
		if (entry == null) {
			return this
		}

		if (entry instanceof TabBarButton) {

			entry.selected = true

			this[$selectedIndex] = index
			this[$selectedEntry] = entry

			this.emit<TabBarSelectEvent>('select', { data: { index } })
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

		this.emit<TabBarDeselectEvent>('deselect', { data: { index } })

		return this
	}

	/**
	 * @method onTabBarButtonTap
	 * @since 0.1.0
	 */
	@bound private onTabBarButtonPress(event: Event) {
		this.select(this.buttons.indexOf(event.sender as TabBarButton))
	}
}

/**
 * @type TabBarBeforeSelectEvent
 * @since 0.1.0
 */
export type TabBarBeforeSelectEvent = {
	index: number | null
}

/**
 * @type TabBarSelectEvent
 * @since 0.1.0
 */
export type TabBarSelectEvent = {
	index: number
}

/**
 * @type TabBarDeselectEvent
 * @since 0.1.0
 */
export type TabBarDeselectEvent = {
	index: number
}