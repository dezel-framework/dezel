import { Dezel } from 'index'
import { property } from 'decorator/property'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Label } from 'component/Label'
import { NavigationBarButton } from 'component/NavigationBarButton'
import { Reference } from 'component/Reference'
import { Slot } from 'view/Slot'
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
	@property public title: string = ''

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
				<Slot id="back-buttons-container" name="back" type={NavigationBarButton} />
				<View id="title-container" ref={this.titleContainerRef} onLayout={() => this.onLayoutTitle}>
					<Label id="title" text={this.title} />
				</View>
				<Slot id="main-buttons-container" name="main" main type={NavigationBarButton} />
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

		let title = this.titleRef.value!
		let titleContainer = this.titleContainerRef.value!

		if (titleContainer.contentDisposition != 'center') {
			title.marginLeft = 0
			title.marginRight = 0
			return
		}

		let outer = this
		let inner = titleContainer

		title.marginLeft = 0
		title.marginRight = 0
		title.maxWidth = inner.measuredWidth

		title.measureIfNeeded()

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
	 * @property titleContainerRef
	 * @since 0.1.0
	 * @hidden
	 */
	private titleContainerRef = Reference.create<View>(this)

	private titleRef = Reference.create<View>(this)


}
