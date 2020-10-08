import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Label } from 'component/Label'
import { Slot } from 'component/Slot'
import { bound } from 'decorator/bound'
import { ref } from 'decorator/ref'
import { View } from 'view/View'
import './NavigationBar.style'

/**
 * @class NavigationBar
 * @super Component
 * @since 0.1.0
 */
export class NavigationBar extends Component {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The navigation bar's title.
	 * @property title
	 * @since 0.1.0
	 */
	@ref public title: Label

	/**
	 * The navigation bar's main buttons.
	 * @property mainButtons
	 * @since 0.1.0
	 */
	@ref public mainButtons: Slot

	/**
	 * The navigation bar's side buttons.
	 * @property sideButtons
	 * @since 0.1.0
	 */
	@ref public sideButtons: Slot

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
				<View id="side-buttons-container">
					<Slot name="back" />
					<Slot name="side" ref={this.sideButtons} />
				</View>
				<View id="title-container" ref={this.titleContainer} onLayout={this.onTitleContainerLayout}>
					<Label id="title" ref={this.title} />
				</View>
				<View id="main-buttons-container">
					<Slot name="main" ref={this.mainButtons} main={true} />
				</View>
			</Body>
		)
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * Correctly position the navigation bar title.
	 * @method onLayoutTitle
	 * @since 0.1.0
	 */
	public onLayoutTitle() {

		if (this.titleContainer.contentDisposition != 'center') {
			this.title.marginLeft = 0
			this.title.marginRight = 0
			return
		}

		let outer = this
		let inner = this.titleContainer
		let title = this.title

		title.marginLeft = 0
		title.marginRight = 0
		title.maxWidth = inner.measuredWidth

		this.title.measure()

		let titleW = title.measuredWidth
		let innerL = inner.measuredLeft
		let innerW = inner.measuredInnerWidth
		let outerW = outer.measuredInnerWidth

		if (titleW < innerW) {

			let outerCenter = outerW / 2
			let innerCenter = innerW / 2 + innerL

			let offset = innerCenter - outerCenter

			let length = Math.abs(offset)
			let extent = Math.abs(offset) + titleW

			if (extent > innerW) {

				/*
				 * Makes sure that the title will fit in the container when
				 * the padding is added.
				 */

				length -= extent - innerW
			}

			let marginL = 0
			let marginR = 0

			if (offset > 0) {
				marginL = 0
				marginR = length * 2
			} else {
				marginL = length * 2
				marginR = 0
			}

			title.marginLeft = marginL
			title.marginRight = marginR
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property titleContainer
	 * @since 0.1.0
	 * @hidden
	 */
	@ref private titleContainer: View

	/**
	 * @method onTitleContainerLayout
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onTitleContainerLayout() {

		/*
		 * Forwards the call so there's no need to add the bound decorator
		 * if the method is overridden
		 */

		this.onLayoutTitle()
	}

}
