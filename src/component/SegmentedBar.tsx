import { Component } from 'component/Component'
import { Slot } from 'component/Slot'
import { bound } from 'decorator/bound'
import { ref } from 'decorator/ref'
import { Event } from 'event/Event'
import { View } from 'view/View'
import { $selectedIndex } from 'component/symbol/SegmentedBar'
import { $selectedValue } from 'component/symbol/SegmentedBar'
import { Body } from 'component/Body'
import { SegmentedBarButton } from 'component/SegmentedBarButton'
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
	@ref public buttons: Slot

	/**
	 * The segmented bar's selected index.
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
				<Slot ref={this.buttons} main={true} />
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

	/**
	 * @inherited
	 * @method onInsert
	 * @since 0.1.0
	 */
	public onInsert(child: View, index: number) {
		if (child instanceof SegmentedBarButton) this.onInsertButton(child, index)
	}

	/**
	 * @inherited
	 * @method onRemove
	 * @since 0.1.0
	 */
	public onRemove(child: View, index: number) {
		if (child instanceof SegmentedBarButton) this.onRemoveButton(child, index)
	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @method onInsertItem
	 * @since 0.1.0
	 * @hidden
	 */
	public onInsertButton(button: SegmentedBarButton, index: number) {

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
	public onRemoveButton(button: SegmentedBarButton, index: number) {

		button.pressed = false

		if (this[$selectedIndex] &&
			this[$selectedIndex]! > index) {
			this[$selectedIndex]!--
		} else if (this[$selectedIndex] == index) {
			this[$selectedIndex] = null
			this[$selectedValue] = null
			button.selected = false
		}

		button.off('press', this.onSegmentedBarButtonPress)
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $selectedIndex
	 * @since 0.1.0
	 * @hidden
	 */
	private [$selectedIndex]: number | null = null

	/**
	 * @property $selectedValue
	 * @since 0.1.0
	 * @hidden
	 */
	private [$selectedValue]: SegmentedBarButton | null = null

	/**
	 * @method applySelection
	 * @since 0.1.0
	 * @hidden
	 */
	private applySelection(index: number) {

		let value = this.buttons.get(index)
		if (value == null) {
			return this
		}

		if (value instanceof SegmentedBarButton) {

			value.selected = true

			this[$selectedIndex] = index
			this[$selectedValue] = value

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
		let value = this[$selectedValue]

		if (value == null ||
			index == null) {
			return this
		}

		value.selected = false

		this[$selectedIndex] = null
		this[$selectedValue] = null

		this.emit<SegmentedBarDeselectEvent>('deselect', { data: { index } })

		return this
	}

	/**
	 * @method onSegmentedBarButtonPress
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onSegmentedBarButtonPress(event: Event) {
		this.select(this.buttons.index(event.sender as SegmentedBarButton))
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