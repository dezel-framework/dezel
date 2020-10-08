import { Component } from 'component/Component'
import { watch } from 'decorator/watch'
import { View } from 'view/View'
import { $selectedIndex } from 'component/symbol/Dots'
import { $selectedValue } from 'component/symbol/Dots'
import { Body } from 'component/Body'
import { Slot } from 'component/Slot'
import './Dots.style'

// TODO

/**
 * @class Dots
 * @super Component
 * @since 0.1.0
 */
export class Dots extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The amount of dots.
	 * @property amount
	 * @since 0.1.0
	 */
	@watch public amount: number = 0

	/**
	 * The dots' selected index.
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
				<Slot main={true} />
			</Body>
		)
	}

	/**
	 * @method select
	 * @since 0.1.0
	 */
	public select(index: number | null) {

		if (index == this.selectedIndex) {
			return this
		}

		this.clearSelection()

		if (index == null) {
			return this
		}

		this.applySelection(index)

		return this
	}

	/**
	 * @inherited
	 * @method onPropertyChange
	 * @since 0.1.0
	 */
	public onPropertyChange(property: string, newValue: any, oldValue: any) {

		if (property == 'amount') {

			this.removeAll()

			let amount = newValue as number
			if (amount) {
				for (let i = 0; i < amount; i++) {
					this.append(<View style="dot" />)
				}
			}
		}
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
	private [$selectedValue]: View | null = null

	/**
	 * @method applySelection
	 * @since 0.1.0
	 * @hidden
	 */
	private applySelection(index: number) {

		let value = this.children[index]
		if (value == null) {
			return this
		}

		value.states.append('selected')

		this[$selectedIndex] = index
		this[$selectedValue] = value

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

		value.states.remove('selected')

		this[$selectedIndex] = null
		this[$selectedValue] = null

		return this
	}
}