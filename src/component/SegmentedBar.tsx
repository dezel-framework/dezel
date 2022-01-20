import { Dezel } from 'index'
import { $buttons } from 'component/symbol/SegmentedBar'
import { $selectedEntry } from 'component/symbol/SegmentedBar'
import { $selectedIndex } from 'component/symbol/SegmentedBar'
import { bound } from 'decorator/bound'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { SegmentedBarButton } from 'component/SegmentedBarButton'
import { Event } from 'event/Event'
import { Slot } from 'view/Slot'
import './SegmentedBar.style'

/**
 * @class SegmentedBar
 * @super Component
 * @since 0.1.0
 */
export class SegmentedBar extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The segmented bar's buttons.
	 * @property buttons
	 * @since 0.1.0
	 */
	public get buttons(): ReadonlyArray<SegmentedBarButton> {
		return this[$buttons]
	}

	/**
	 * The segmented bar's selected index.
	 * @property selectedIndex
	 * @since 0.1.0
	 */
	public get selectedIndex(): number | null {
		return this[$selectedIndex]
	}

	/**
	 * The segmented bar's selected index.
	 * @property selectedIndex
	 * @since 0.1.0
	 */
	public set selectedIndex(value: number | null) {
		this.select(value)
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
					type={SegmentedBarButton}
					onInsert={(c: SegmentedBarButton, i: number) => this.onInsertButton(c, i)}
					onRemove={(c: SegmentedBarButton, i: number) => this.onRemoveButton(c, i)}
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

		let event = new Event<SegmentedBarBeforeSelectEvent>('beforeselect', {
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
	protected onInsertButton(button: SegmentedBarButton, index: number) {

		this[$buttons].splice(index, 0, button)

		if (this[$selectedIndex] &&
			this[$selectedIndex]! >= index) {
			this[$selectedIndex]!++
		}

		button.on('press', this.onSegmentedBarButtonPress)
	}

	/**
	 * @method onRemoveButton
	 * @since 0.1.0
	 * @hidden
	 */
	protected onRemoveButton(button: SegmentedBarButton, index: number) {

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

		button.off('press', this.onSegmentedBarButtonPress)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $buttons
	 * @since 0.1.0
	 * @hidden
	 */
	private [$buttons]: Array<SegmentedBarButton> = []

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
	private [$selectedEntry]: SegmentedBarButton | null = null

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

		if (entry instanceof SegmentedBarButton) {

			entry.selected = true

			this[$selectedIndex] = index
			this[$selectedEntry] = entry

			this.emit<SegmentedBarSelectEvent>('select', { data: { index } })
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

		this.emit<SegmentedBarDeselectEvent>('deselect', { data: { index } })

		return this
	}

	/**
	 * @method onSegmentedBarButtonPress
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onSegmentedBarButtonPress(event: Event) {
		this.select(this.buttons.indexOf(event.sender as SegmentedBarButton))
	}
}

/**
 * @type SegmentedBarBeforeSelectEvent
 * @since 0.1.0
 */
export type SegmentedBarBeforeSelectEvent = {
	index: number | null
}

/**
 * @type SegmentedBarSelectEvent
 * @since 0.1.0
 */
export type SegmentedBarSelectEvent = {
	index: number
}

/**
 * @type SegmentedBarDeselectEvent
 * @since 0.1.0
 */
export type SegmentedBarDeselectEvent = {
	index: number
}