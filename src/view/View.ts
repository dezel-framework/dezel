import { $responder } from 'event/symbol/Emitter'
import { $children } from 'view/symbol/View'
import { $defaults } from 'view/symbol/View'
import { $gestures } from 'view/symbol/View'
import { $host } from 'view/symbol/View'
import { $lock } from 'view/symbol/View'
import { $root } from 'view/symbol/View'
import { $slot } from 'view/symbol/View'
import { $states } from 'view/symbol/View'
import { $styles } from 'view/symbol/View'
import { bridge } from 'native/bridge'
import { native } from 'native/native'
import { set } from 'util/object'
import { canInsert } from 'view/private/View'
import { canRemove } from 'view/private/View'
import { getClassName } from 'view/private/View'
import { insertChild } from 'view/private/View'
import { insertEntry } from 'view/private/View'
import { removeChild } from 'view/private/View'
import { removeEntry } from 'view/private/View'
import { setRoot } from 'view/private/View'
import { Emitter } from 'event/Emitter'
import { Event } from 'event/Event'
import { TouchEvent } from 'event/TouchEvent'
import { GestureManager } from 'gesture/GestureManager'
import { Canvas } from 'graphic/Canvas'
import { JSXProperties } from 'type/JSX'
import { Slot } from 'view/Slot'
import { StateList } from 'view/StateList'
import { StyleList } from 'view/StyleList'
import { Window } from 'view/Window'

@bridge('dezel.view.View')

/**
 * @class View
 * @super Emitter
 * @since 0.1.0
 */
export class View extends Emitter {

	//--------------------------------------------------------------------------
	// Static Methods
	//--------------------------------------------------------------------------

	/**
	 * Performs a transition animation.
	 * @method transition
	 * @since 0.1.0
	 */
	public static transition(animate: Function): Promise<void>
	public static transition(options: ViewTransitionOptions, animate: Function): Promise<void>
	public static transition(...args: Array<any>): Promise<void> {

		let animate: Function
		let options: ViewTransitionOptions = {
			duration: AnimationDefaultDuration,
			equation: AnimationDefaultEquation,
			delay: 0
		}

		switch (args.length) {

			case 1:
				animate = args[0]
				break

			case 2:
				animate = args[1]
				options = args[0]
				break

		}

		let duration = AnimationDefaultDuration
		let equation = AnimationDefaultEquation
		let delay = options.delay || 0

		if (typeof options.duration == 'string') {

			let value = AnimationDurationRegistry.get(options.duration)
			if (value) {
				duration = value
			} else {
				duration = AnimationDefaultDuration
			}

		} else {

			duration = options.duration || AnimationDefaultDuration

		}

		if (typeof options.equation == 'string') {

			let value = AnimationEquationRegistry.get(options.equation)
			if (value) {

				equation = value

			} else {

				let values = options.equation.replace(/\s+/g, '').match(/cubic-bezier\(([-.\d]+),([-.\d]+),([-.\d]+),([-.\d]+)\)/)
				if (values) {
					equation = [
						+values[1],
						+values[2],
						+values[3],
						+values[4]
					]

				} else {

					equation = AnimationDefaultEquation

				}
			}
		}

		return new Promise(success => {

			native(View).transition(
				duration,
				equation[0],
				equation[1],
				equation[2],
				equation[3],
				delay,
				success,
				animate
			)

		})
	}

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The view's style list.
	 * @property styles
	 * @since 0.1.0
	 */
	public get styles(): StyleList {
		return this[$styles]
	}

	/**
	 * The view's state list.
	 * @property states
	 * @since 0.1.0
	 */
	public get states(): StateList {
		return this[$states]
	}

	/**
	 * The view's window.
	 * @property window
	 * @since 0.1.0
	 */
	public get window(): Window | null {
		return native(this).window
	}

	/**
	 * The view's parent.
	 * @property parent
	 * @since 0.1.0
	 */
	public get parent(): View | null {
		return this[$host] ? this[$host] : native(this).parent
	}

	/**
	 * The view's children.
	 * @property children
	 * @since 0.1.0
	 */
	public get children(): ReadonlyArray<View> {
		return this[$children]
	}

	/**
	 * The view's gestures.
	 * @property gestures
	 * @since 0.1.0
	 */
	public get gestures(): GestureManager {
		return this[$gestures]
	}

	/**
	 * The view's slot.
	 * @property slot
	 * @since 0.1.0
	 */
	public slot: string | null = null

	/**
	 * The view's id.
	 * @property id
	 * @since 0.1.0
	 */
	@native public id: string

	/**
	 * The view's background color.
	 * @property backgroundColor
	 * @since 0.1.0
	 */
	@native public backgroundColor: string

	/**
	 * The view's background image.
	 * @property backgroundImage
	 * @since 0.1.0
	 */
	@native public backgroundImage: string | null

	/**
	 * The view's background image fit mode.
	 * @property backgroundImageFit
	 * @since 0.1.0
	 */
	@native public backgroundImageFit: 'contain' | 'cover'

	/**
	 * The view's background image position.
	 * @property backgroundImagePosition
	 * @since 0.1.0
	 */
	@native public backgroundImagePosition: 'top left' | 'top right' | 'top center' | 'left' | 'right' | 'center' | 'bottom left' | 'bottom right' | 'bottom center'

	/**
	 * The view's border.
	 * @property border
	 * @since 0.1.0
	 */
	@native public border: any

	/**
	 * The view's border width.
	 * @property borderWidth
	 * @since 0.1.0
	 */
	@native public borderWidth: any

	/**
	 * The view's border color.
	 * @property borderColor
	 * @since 0.1.0
	 */
	@native public borderColor: any

	/**
	 * The view's top border.
	 * @property borderTop
	 * @since 0.1.0
	 */
	@native public borderTop: any

	/**
	 * The view's left border.
	 * @property borderLeft
	 * @since 0.1.0
	 */
	@native public borderLeft: any

	/**
	 * The view's right border.
	 * @property borderRight
	 * @since 0.1.0
	 */
	@native public borderRight: any

	/**
	 * The view's bottom border.
	 * @property borderBottom
	 * @since 0.1.0
	 */
	@native public borderBottom: any

	/**
	 * The view's top border color.
	 * @property borderTopColor
	 * @since 0.1.0
	 */
	@native public borderTopColor: string

	/**
	 * The view's left border color.
	 * @property borderLeftColor
	 * @since 0.1.0
	 */
	@native public borderLeftColor: string

	/**
	 * The view's right border color.
	 * @property borderRightColor
	 * @since 0.1.0
	 */
	@native public borderRightColor: string

	/**
	 * The view's bottom border color.
	 * @property borderBottomColor
	 * @since 0.1.0
	 */
	@native public borderBottomColor: string

	/**
	 * The view's top border width.
	 * @property borderTopWidth
	 * @since 0.1.0
	 */
	@native public borderTopWidth: number | string

	/**
	 * The view's left border width.
	 * @property borderLeftWidth
	 * @since 0.1.0
	 */
	@native public borderLeftWidth: number | string

	/**
	 * The view's right border width.
	 * @property borderRightWidth
	 * @since 0.1.0
	 */
	@native public borderRightWidth: number | string

	/**
	 * The view's bottom border width.
	 * @property borderBottomWidth
	 * @since 0.1.0
	 */
	@native public borderBottomWidth: number | string

	/**
	 * The view's minimum top border width.
	 * @property minBorderTopWidth
	 * @since 0.1.0
	 */
	@native public minBorderTopWidth: number

	/**
	 * The view's maximum top border width.
	 * @property maxBorderTopWidth
	 * @since 0.1.0
	 */
	@native public maxBorderTopWidth: number

	/**
	 * The view's minimum left border width.
	 * @property minBorderLeftWidth
	 * @since 0.1.0
	 */
	@native public minBorderLeftWidth: number

	/**
	 * The view's maximum left border width.
	 * @property maxBorderLeftWidth
	 * @since 0.1.0
	 */
	@native public maxBorderLeftWidth: number

	/**
	 * The view minimum right border width.
	 * @property minBorderRightWidth
	 * @since 0.1.0
	 */
	@native public minBorderRightWidth: number

	/**
	 * The view's maximum right border width.
	 * @property maxBorderRightWidth
	 * @since 0.1.0
	 */
	@native public maxBorderRightWidth: number

	/**
	 * The view's minimum bottom border width.
	 * @property minBorderBottomWidth
	 * @since 0.1.0
	 */
	@native public minBorderBottomWidth: number

	/**
	 * The view's maximum bottom border width.
	 * @property maxBorderBottomWidth
	 * @since 0.1.0
	 */
	@native public maxBorderBottomWidth: number

	/**
	 * The view's border radius.
	 * @property cornerRadius
	 * @since 0.1.0
	 */
	@native public cornerRadius: any

	/**
	 * The view's border top left radius.
	 * @property cornerTopLeftRadius
	 * @since 0.1.0
	 */
	@native public cornerTopLeftRadius: number

	/**
	 * The view's border top right radius.
	 * @property cornerTopRightRadius
	 * @since 0.1.0
	 */
	@native public cornerTopRightRadius: number

	/**
	 * The view's border bottom left radius.
	 * @property cornerBottomLeftRadius
	 * @since 0.1.0
	 */
	@native public cornerBottomLeftRadius: number

	/**
	 * The view'S border bottom right radius.
	 * @property cornerBottomRightRadius
	 * @since 0.1.0
	 */
	@native public cornerBottomRightRadius: number

	/**
	 * The view's shadow blur size.
	 * @property shadowBlur
	 * @since 0.1.0
	 */
	@native public shadowBlur: number

	/**
	 * The view's shadow color.
	 * @property shadowColor
	 * @since 0.1.0
	 */
	@native public shadowColor: string

	/**
	 * The view's shadow top offset.
	 * @property shadowOffsetTop
	 * @since 0.1.0
	 */
	@native public shadowOffsetTop: number

	/**
	 * The view's shadow left offset.
	 * @property shadowOffsetLeft
	 * @since 0.1.0
	 */
	@native public shadowOffsetLeft: number

	/**
	 * The view's top position.
	 * @property top
	 * @since 0.1.0
	 */
	@native public top: number | string | 'auto'

	/**
	 * The view's left position.
	 * @property left
	 * @since 0.1.0
	 */
	@native public left: number | string | 'auto'

	/**
	 * The view's right position.
	 * @property right
	 * @since 0.1.0
	 */
	@native public right: number | string | 'right'

	/**
	 * The view's bottom position.
	 * @property bottom
	 * @since 0.1.0
	 */
	@native public bottom: number | string | 'string'

	/**
	 * The view's minimum top position.
	 * @property minTop
	 * @since 0.1.0
	 */
	@native public minTop: number

	/**
	 * The view's maximum top position.
	 * @property maxTop
	 * @since 0.1.0
	 */
	@native public maxTop: number

	/**
	 * The view's minimum left position.
	 * @property minLeft
	 * @since 0.1.0
	 */
	@native public minLeft: number

	/**
	 * The view's maximum left position.
	 * @property maxLeft
	 * @since 0.1.0
	 */
	@native public maxLeft: number

	/**
	 * The view's minimum right position.
	 * @property minRight
	 * @since 0.1.0
	 */
	@native public minRight: number

	/**
	 * The view's maximum right position.
	 * @property maxRight
	 * @since 0.1.0
	 */
	@native public maxRight: number

	/**
	 * The view's minimum bottom position.
	 * @property minBottom
	 * @since 0.1.0
	 */
	@native public minBottom: number

	/**
	 * The view's max bottom position.
	 * @property maxBottom
	 * @since 0.1.0
	 */
	@native public maxBottom: number

	/**
	 * The view's top position anchor.
	 * @property anchorTop
	 * @since 0.1.0
	 */
	@native public anchorTop: 'top' | 'center' | 'bottom' | number | string

	/**
	 * The view's left position anchor.
	 * @property anchorLeft
	 * @since 0.1.0
	 */
	@native public anchorLeft: 'left' | 'center' | 'right' | number | string

	/**
	 * The view's width.
	 * @property width
	 * @since 0.1.0
	 */
	@native public width: number | string | 'fill' | 'wrap'

	/**
	 * The view's height.
	 * @property height
	 * @since 0.1.0
	 */
	@native public height: number | string | 'fill' | 'wrap'

	/**
	 * The view's minimum width.
	 * @property minWidth
	 * @since 0.1.0
	 */
	@native public minWidth: number

	/**
	 * The view's maximum width.
	 * @property maxWidth
	 * @since 0.1.0
	 */
	@native public maxWidth: number

	/**
	 * The view's minimum height.
	 * @property minHeight
	 * @since 0.1.0
	 */
	@native public minHeight: number

	/**
	 * The view's maximum height.
	 * @property maxHeight
	 * @since 0.1.0
	 */
	@native public maxHeight: number

	/**
	 * The view's ratio by with it will expand to fill the remaining space.
	 * @property expandRatio
	 * @since 0.1.0
	 */
	@native public expandRatio: number

	/**
	 * The view's ratio by with it will shrink to fit the available space.
	 * @property shrinkRatio
	 * @since 0.1.0
	 */
	@native public shrinkRatio: number

	/**
	 * The view's content top position.
	 * @property contentTop
	 * @since 0.1.0
	 */
	@native public contentTop: number

	/**
	 * The view'S content left position.
	 * @property contentLeft
	 * @since 0.1.0
	 */
	@native public contentLeft: number

	/**
	 * The view's content width.
	 * @property contentWidth
	 * @since 0.1.0
	 */
	@native public contentWidth: number | string | 'auto'

	/**
	 * The view's content height.
	 * @property contentHeight
	 * @since 0.1.0
	 */
	@native public contentHeight: number | string | 'auto'

	/**
	 * The view's content top inset.
	 * @property contentInsetTop
	 * @since 0.1.0
	 */
	@native public contentInsetTop: number

	/**
	 * The view's content left inset.
	 * @property contentInsetLeft
	 * @since 0.1.0
	 */
	@native public contentInsetLeft: number

	/**
	 * The view's content right inset.
	 * @property contentInsetRight
	 * @since 0.1.0
	 */
	@native public contentInsetRight: number

	/**
	 * The view's content bottom inset.
	 * @property contentInsetBottom
	 * @since 0.1.0
	 */
	@native public contentInsetBottom: number

	/**
	 * The view's content direction.
	 * @property contentDirection
	 * @since 0.1.0
	 */
	@native public contentDirection: 'vertical' | 'horizontal'

	/**
	 * The view's content alignment.
	 * @property contentAlignment
	 * @since 0.1.0
	 */
	@native public contentAlignment: 'start' | 'center' | 'end'

	/**
	 * The view's content disposition.
	 * @property contentDisposition
	 * @since 0.1.0
	 */
	@native public contentDisposition: 'start' | 'center' | 'end' | 'space-around' | 'space-between' | 'space-evenly'

	/**
	 * The view's margin.
	 * @property margin
	 * @since 0.1.0
	 */
	@native public margin: any

	/**
	 * The view's top margin.
	 * @property marginTop
	 * @since 0.1.0
	 */
	@native public marginTop: number | string

	/**
	 * The view's left margin.
	 * @property marginLeft
	 * @since 0.1.0
	 */
	@native public marginLeft: number | string

	/**
	 * The view's right margin.
	 * @property marginRight
	 * @since 0.1.0
	 */
	@native public marginRight: number | string

	/**
	 * The view's bottom margin.
	 * @property marginBottom
	 * @since 0.1.0
	 */
	@native public marginBottom: number | string

	/**
	 * The view's minimum top margin.
	 * @property minMarginTop
	 * @since 0.1.0
	 */
	@native public minMarginTop: number

	/**
	 * The view's maximum top margin.
	 * @property maxMarginTop
	 * @since 0.1.0
	 */
	@native public maxMarginTop: number

	/**
	 * The view's minimum left margin.
	 * @property minMarginLeft
	 * @since 0.1.0
	 */
	@native public minMarginLeft: number

	/**
	 * The view's maximum left margin.
	 * @property maxMarginLeft
	 * @since 0.1.0
	 */
	@native public maxMarginLeft: number

	/**
	 * The view's minimum right margin.
	 * @property minMarginRight
	 * @since 0.1.0
	 */
	@native public minMarginRight: number

	/**
	 * The view's maximum right margin.
	 * @property maxMarginRight
	 * @since 0.1.0
	 */
	@native public maxMarginRight: number

	/**
	 * The view's minimum bottom margin.
	 * @property minMarginBottom
	 * @since 0.1.0
	 */
	@native public minMarginBottom: number

	/**
	 * The view's maximum bottom margin.
	 * @property maxMarginBottom
	 * @since 0.1.0
	 */
	@native public maxMarginBottom: number

	/**
	 * The view's padding.
	 * @property padding
	 * @since 0.1.0
	 */
	@native public padding: any

	/**
	 * The view's top padding.
	 * @property paddingTop
	 * @since 0.1.0
	 */
	@native public paddingTop: number | string

	/**
	 * The view's left padding.
	 * @property paddingLeft
	 * @since 0.1.0
	 */
	@native public paddingLeft: number | string

	/**
	 * The view's right padding.
	 * @property paddingRight
	 * @since 0.1.0
	 */
	@native public paddingRight: number | string

	/**
	 * The view's bottom padding.
	 * @property paddingBottom
	 * @since 0.1.0
	 */
	@native public paddingBottom: number | string

	/**
	 * The view's minimum top padding.
	 * @property minPaddingTop
	 * @since 0.1.0
	 */
	@native public minPaddingTop: number

	/**
	 * The view's maximum top padding.
	 * @property maxPaddingTop
	 * @since 0.1.0
	 */
	@native public maxPaddingTop: number

	/**
	 * The view's minimum left padding.
	 * @property minPaddingLeft
	 * @since 0.1.0
	 */
	@native public minPaddingLeft: number

	/**
	 * The view's maximum left padding.
	 * @property maxPaddingLeft
	 * @since 0.1.0
	 */
	@native public maxPaddingLeft: number

	/**
	 * The view's minimm right padding.
	 * @property minPaddingRight
	 * @since 0.1.0
	 */
	@native public minPaddingRight: number

	/**
	 * The view's maximum right padding.
	 * @property maxPaddingRight
	 * @since 0.1.0
	 */
	@native public maxPaddingRight: number

	/**
	 * The view's minimum bottom padding.
	 * @property minPaddingBottom
	 * @since 0.1.0
	 */
	@native public minPaddingBottom: number

	/**
	 * The view's maximum bottom padding.
	 * @property maxPaddingBottom
	 * @since 0.1.0
	 */
	@native public maxPaddingBottom: number

	/**
	 * The view's tranform origin on the x axis.
	 * @property originX
	 * @since 0.1.0
	 */
	@native public originX: number

	/**
	 * The view's transform origin on the y axis.
	 * @property originY
	 * @since 0.1.0
	 */
	@native public originY: number

	/**
	 * The view's transform origin on the z axis.
	 * @property originZ
	 * @since 0.1.0
	 */
	@native public originZ: number

	/**
	 * The view's translation on the x axis
	 * @property translationX
	 * @since 0.1.0
	 */
	@native public translationX: number | string

	/**
	 * The view's translation on the y axis.
	 * @property translationY
	 * @since 0.1.0
	 */
	@native public translationY: number | string

	/**
	 * The view's translation on the z axis.
	 * @property translationZ
	 * @since 0.1.0
	 */
	@native public translationZ: number

	/**
	 * The view's rotation on the x axis.
	 * @property rotationX
	 * @since 0.1.0
	 */
	@native public rotationX: number | string

	/**
	 * The view's rotation on the y axis.
	 * @property rotationY
	 * @since 0.1.0
	 */
	@native public rotationY: number | string

	/**
	 * The view's rotation on the z axis.
	 * @property rotationZ
	 * @since 0.1.0
	 */
	@native public rotationZ: number | string

	/**
	 * The view's scale on the x axis.
	 * @property scaleX
	 * @since 0.1.0
	 */
	@native public scaleX: number

	/**
	 * The view's scale on the y axis.
	 * @property scaleY
	 * @since 0.1.0
	 */
	@native public scaleY: number

	/**
	 * The view's scale on the z axis.
	 * @property scaleZ
	 * @since 0.1.0
	 */
	@native public scaleZ: number

	/**
	 * The view's relative position on the z axis.
	 * @property zIndex
	 * @since 0.1.0
	 */
	@native public zIndex: number

	/**
	 * Whether the view is scrollable.
	 * @property scrollable
	 * @since 0.1.0
	 */
	@native public scrollable: boolean

	/**
	 * Whether the view has scrollbars.
	 * @property scrollbars
	 * @since 0.1.0
	 */
	@native public scrollbars: boolean | 'none' | 'both' | 'vertical' | 'horizontal'

	/**
	 * Whether the view can overscroll.
	 * @property overscroll
	 * @since 0.1.0
	 */
	@native public overscroll: boolean | 'auto' | 'never' | 'always' | 'always-x' | 'always-y'

	/**
	 * The view's top scroll position.
	 * @property scrollTop
	 * @since 0.1.0
	 */
	@native public scrollTop: number

	/**
	 * The view's left scroll position.
	 * @property scrollLeft
	 * @since 0.1.0
	 */
	@native public scrollLeft: number

	/**
	 * Whether the view can scroll on its own inertial
	 * @property scrollInertia
	 * @since 0.1.0
	 */
	@native public scrollInertia: boolean

	/**
	 * Whether the view is scrolling.
	 * @property scrolling
	 * @since 0.1.0
	 */
	@native public scrolling: boolean

	/**
	 * Whether the view is dragging.
	 * @property dragging
	 * @since 0.1.0
	 */
	@native public dragging: boolean

	/**
	 * Whether the view can zoom.
	 * @property zoomable
	 * @since 0.1.0
	 */
	@native public zoomable: boolean

	/**
	 * The view's minimum zoom factor.
	 * @property minZoom
	 * @since 0.1.0
	 */
	@native public minZoom: number

	/**
	 * The view's maximum zoom factor.
	 * @property maxZoom
	 * @since 0.1.0
	 */
	@native public maxZoom: number

	/**
	 * The view that is zoomed.
	 * @property zoomedView
	 * @since 0.1.0
	 */
	@native public zoomedView: View | null

	/**
	 * Whether the view is touchable
	 * @property touchable
	 * @since 0.1.0
	 */
	@native public touchable: boolean

	/**
	 * The view's top touch offset.
	 * @property touchOffsetTop
	 * @since 0.1.0
	 */
	@native public touchOffsetTop: number

	/**
	 * The view's left touch offset.
	 * @property touchOffsetLeft
	 * @since 0.1.0
	 */
	@native public touchOffsetLeft: number

	/**
	 * The view's right touch offset.
	 * @property touchOffsetRight
	 * @since 0.1.0
	 */
	@native public touchOffsetRight: number

	/**
	 * The view's bottom touch offset.
	 * @property touchOffsetBottom
	 * @since 0.1.0
	 */
	@native public touchOffsetBottom: number

	/**
	 * Whether the view is visible.
	 * @property visible
	 * @since 0.1.0
	 */
	@native public visible: boolean

	/**
	 * The view's opacity.
	 * @property opacity
	 * @since 0.1.0
	 */
	@native public opacity: number

	/**
	 * Whether the view supports custom drawing.
	 * @property drawable
	 * @since 0.1.0
	 */
	@native public drawable: boolean

	/**
	 * Whether the view's content is clipped.
	 * @property clipped
	 * @since 0.1.0
	 */
	@native public clipped: boolean

	/**
	 * Whether the view is paged.
	 * @property paged
	 * @since 0.1.0
	 */
	@native public paged: boolean

	/**
	 * The view's measured top position.
	 * @property measuredTop
	 * @since 0.1.0
	 */
	@native public readonly measuredTop: number

	/**
	 * The view's measured left position.
	 * @property measuredLeft
	 * @since 0.1.0
	 */
	@native public readonly measuredLeft: number

	/**
	 * The view's measured width.
	 * @property measuredWidth
	 * @since 0.1.0
	 */
	@native public readonly measuredWidth: number

	/**
	 * The view's measured height.
	 * @property measuredHeight
	 * @since 0.1.0
	 */
	@native public readonly measuredHeight: number

	/**
	 * The view's measured inner width.
	 * @property measuredInnerWidth
	 * @since 0.1.0
	 */
	@native public readonly measuredInnerWidth: number

	/**
	 * The view's measured inner height.
	 * @property measuredInnerHeight
	 * @since 0.1.0
	 */
	@native public readonly measuredInnerHeight: number

	/**
	 * The view's measured content width.
	 * @property measuredContentWidth
	 * @since 0.1.0
	 */
	@native public readonly measuredContentWidth: number

	/**
	 * The view's measured content height.
	 * @property measuredContentHeight
	 * @since 0.1.0
	 */
	@native public readonly measuredContentHeight: number

	/**
	 * The view's measured top margin.
	 * @property measuredMarginTop
	 * @since 0.1.0
	 */
	@native public readonly measuredMarginTop: number

	/**
	 * The view's measured left margin.
	 * @property measuredMarginLeft
	 * @since 0.1.0
	 */
	@native public readonly measuredMarginLeft: number

	/**
	 * The view's measured right margin.
	 * @property measuredMarginRight
	 * @since 0.1.0
	 */
	@native public readonly measuredMarginRight: number

	/**
	 * The view's measured bottom margin.
	 * @property measuredMarginBottom
	 * @since 0.1.0
	 */
	@native public readonly measuredMarginBottom: number

	/**
	 * The view's measured top margin.
	 * @property measuredPaddingTop
	 * @since 0.1.0
	 */
	@native public readonly measuredPaddingTop: number

	/**
	 * The view's measured left padding.
	 * @property measuredPaddingLeft
	 * @since 0.1.0
	 */
	@native public readonly measuredPaddingLeft: number

	/**
	 * The view's measured right padding.
	 * @property measuredPaddingRight
	 * @since 0.1.0
	 */
	@native public readonly measuredPaddingRight: number

	/**
	 * The view's measured bottom padding.
	 * @property measuredPaddingBottom
	 * @since 0.1.0
	 */
	@native public readonly measuredPaddingBottom: number

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the view.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor() {
		super()
		native(this).className = getClassName(this)
	}

	/**
	 * Destroys the view.
	 * @method destroy
	 * @since 0.1.0
	 */
	public destroy() {

		/*
		 * The native side will trigger the calls to the onDestroy
		 * for this view and the hierarchy. Do not put anything else
		 * in this method.
		 */

		native(this).destroy()

		return super.destroy()
	}

	/**
	 * Appends a child view.
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View) {
		this.insert(child, this.children.length)
		return this
	}

	/**
	 * Inserts a child view at a specified index.
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View, index: number) {

		canInsert(this, child, index)

		if (index > this.children.length) {
			index = this.children.length
		} else if (index < 0) {
			index = 0
		}

		if (child.parent) {
			child.parent.remove(child)
		}

		child[$responder] = this

		insertEntry(this, child, index)
		insertChild(this, child, index)

		setRoot(child, this[$root])

		this.emit<ViewInsertEvent>('insert', { data: { child, index } })

		return this
	}

	/**
	 * Removes a child view with another.
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View) {

		canRemove(this, child)

		let index = this.children.indexOf(child)
		if (index == -1) {
			return this
		}

		child[$responder] = null

		removeEntry(this, child, index)
		removeChild(this, child, index)

		setRoot(child, null)

		this.emit<ViewRemoveEvent>('remove', { data: { child, index } })

		return this
	}

	/**
	 * Removes this view from its parent.
	 * @method removeFromParent
	 * @since 0.1.0
	 */
	public removeFromParent() {

		let parent = this.parent
		if (parent) {
			parent.remove(this)
		}

		return this
	}

	/**
	 * Remove all views.
	 * @method empty
	 * @since 0.1.0
	 */
	public empty() {

		while (this.children.length) {
			this.remove(this.children[0])
		}

		return this
	}

	/**
	 * Whether the view or its hierarchy contains the specified view.
	 * @method contains
	 * @since 0.1.0
	 */
	public contains(view: View) {

		let parent = view.parent
		if (parent == this) {
			return true
		}

		while (parent) {

			if (parent == this) {
				return true
			}

			parent = parent.parent
		}

		return false
	}

	//--------------------------------------------------------------------------
	// Methods: Measuring and Drawing
	//--------------------------------------------------------------------------

	/**
	 * Indicates this view needs to be redrawn on the next frame.
	 * @method scheduleRedraw
	 * @since 0.1.0
	 */
	public scheduleRedraw() {
		native(this).scheduleRedraw()
		return this
	}

	/**
	 * Indicates this view needs to update its layout on the next frame.
	 * @method scheduleLayout
	 * @since 0.1.0
	 */
	public scheduleLayout() {
		native(this).scheduleLayout()
		return this
	}

	/**
	 * Resolves the view's layout and properties.
	 * @method resolveIfNeeded
	 * @since 0.1.0
	 */
	public resolveIfNeeded() {
		native(this).resolveIfNeeded()
		return this
	}

	/**
	 * Measures this view without resolving the whole layout.
	 * @method measureIfNeeded
	 * @since 0.1.0
	 */
	public measureIfNeeded() {
		native(this).measureIfNeeded()
		return this
	}

	//--------------------------------------------------------------------------
	// Methods: Animation
	//--------------------------------------------------------------------------

	/**
	 * Performs a transition animation.
	 * @method transition
	 * @since 0.1.0
	 */
	public transition(animate: ViewTransitionProperties<View>): Promise<void>
	public transition(options: ViewTransitionOptions, animate: ViewTransitionProperties<View>): Promise<void>
	public transition(...args: Array<any>): Promise<void> {

		let animate: any = {}
		let options: ViewTransitionOptions = {
			duration: AnimationDefaultDuration,
			equation: AnimationDefaultEquation,
			delay: 0
		}

		if (args.length == 2) {
			options = args[0]
			animate = args[1]
		} else {
			animate = args[0]
		}

		return View.transition(options, () => {
			for (let key in animate) {
				set(this, key, animate[key])
			}
		})
	}

	//--------------------------------------------------------------------------
	// Scrolling
	//--------------------------------------------------------------------------

	/**
	 * Scrolls to the specified location.
	 * @method scrollTo
	 * @since 0.1.0
	 */
	public scrollTo(top: number, left: number = 0) {
		native(this).scrollTo(top, left)
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

		super.onEvent(event)

		if (event instanceof TouchEvent) {

			switch (event.type) {

				case 'touchstart':
					this.onTouchStart(event)
					break

				case 'touchmove':
					this.onTouchMove(event)
					break

				case 'touchend':
					this.onTouchEnd(event)
					break

				case 'touchcancel':
					this.onTouchCancel(event)
					break
			}

			this.gestures.onTouchEvent(event)
		}

		switch (event.type) {

			case 'destroy':
				this.onDestroy()
				break

			case 'beforelayout':
				this.onBeforeLayout()
				break

			case 'layout':
				this.onLayout()
				break

			case 'redraw':
				this.onRedraw(event.data.canvas)
				break

			case 'insert':
				this.onInsert(event.data.child, event.data.index)
				break

			case 'remove':
				this.onRemove(event.data.child, event.data.index)
				break

			case 'movetoparent':
				this.onMoveToParent(event.data.parent, event.data.former)
				break

			case 'movetowindow':
				this.onMoveToWindow(event.data.window, event.data.former)
				break

			case 'ready':
				this.onReady()
				break

			case 'scrollstart':
				this.onScrollStart()
				break

			case 'scrollend':
				this.onScrollEnd()
				break

			case 'scroll':
				this.onScroll()
				break

			case 'overscroll':
				this.onOverscroll()
				break

			case 'dragstart':
				this.onDragStart()
				break

			case 'dragend':
				this.onDragEnd()
				break

			case 'drag':
				this.onDrag()
				break

			case 'zoomstart':
				this.onZoomStart()
				break

			case 'zoomend':
				this.onZoomEnd()
				break

			case 'zoom':
				this.onZoom()
				break
		}
	}

	/**
	 * Called when the view is destroyed.
	 * @method onDestroy
	 * @since 0.1.0
	 */
	public onDestroy() {
		if (this.parent) {
			this.parent.remove(this)
		}
	}

	/**
	 * Called before the layout is resolved.
	 * @method onBeforeLayout
	 * @since 0.1.0
	 */
	public onBeforeLayout() {

	}

	/**
	 * Called the layout is resolved.
	 * @method onLayout
	 * @since 0.1.0
	 */
	public onLayout() {

	}

	/**
	 * Called when the view needs to be drawn.
	 * @method onRedraw
	 * @since 0.1.0
	 */
	public onRedraw(canvas: Canvas) {

	}

	/**
	 * Called when the view inserts a child view.
	 * @method onInsert
	 * @since 0.1.0
	 */
	public onInsert(child: View, index: number) {

	}

	/**
	 * Called when the view removes a child view.
	 * @method onRemove
	 * @since 0.1.0
	 */
	public onRemove(child: View, index: number) {

	}

	/**
	 * Called when the view is assigned to or removed from a window.
	 * @method onMoveToWindow
	 * @since 0.1.0
	 */
	public onMoveToWindow(window: Window | null, former: Window | null) {

	}

	/**
	 * Called when the view is assigned to or removed from another view.
	 * @method onMoveToParent
	 * @since 0.1.0
	 */
	public onMoveToParent(parent: View | null, former: View | null) {

	}

	/**
	 * Called when the view is in a window tree.
	 * @method onReady
	 * @since 0.1.0
	 */
	public onReady() {

	}

	/**
	 * Called when the view begins scrolling.
	 * @method onScrollStart
	 * @since 0.1.0
	 */
	public onScrollStart() {

	}

	/**
	 * Called when the view finishes scrolling.
	 * @method onScrollEnd
	 * @since 0.1.0
	 */
	public onScrollEnd() {

	}

	/**
	 * Called when the view scrolls.
	 * @method onScroll
	 * @since 0.1.0
	 */
	public onScroll() {

	}

	/**
	 * Called when the view overscrolls.
	 * @method onOverscroll
	 * @since 0.1.0
	 */
	public onOverscroll() {

	}

	/**
	 * Called when the view begins dragging.
	 * @method onDragStart
	 * @since 0.1.0
	 */
	public onDragStart() {

	}

	/**
	 * Called when the view finishes dragging.
	 * @method onDragEnd
	 * @since 0.1.0
	 */
	public onDragEnd() {

	}

	/**
	 * Called when the view is being dragged.
	 * @method onDrag
	 * @since 0.1.0
	 */
	public onDrag() {

	}

	/**
	 * Called when the view begins zooming.
	 * @method onZoomStart
	 * @since 0.1.0
	 */
	public onZoomStart() {

	}

	/**
	 * Called when the view finishes zooming.
	 * @method onZoomEnd
	 * @since 0.1.0
	 */
	public onZoomEnd() {

	}

	/**
	 * Called when the view zooms.
	 * @method onZoom
	 * @since 0.1.0
	 */
	public onZoom() {

	}

	/**
	 * Called when the view receives a touch start event.
	 * @method onTouchStart
	 * @since 0.1.0
	 */
	public onTouchStart(event: TouchEvent) {

	}

	/**
	 * Called when the view receives a touch move event.
	 * @method onTouchMove
	 * @since 0.1.0
	 */
	public onTouchMove(event: TouchEvent) {

	}

	/**
	 * Called when the view receives a touch end event.
	 * @method onTouchEnd
	 * @since 0.1.0
	 */
	public onTouchEnd(event: TouchEvent) {

	}

	/**
	 * Called when the view receives a touch cancel event.
	 * @method onTouchCancel
	 * @since 0.1.0
	 */
	public onTouchCancel(event: TouchEvent) {

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

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $styles
	 * @since 0.1.0
	 * @hidden
	 */
	private [$styles]: StyleList = new StyleList(this)

	/**
	 * @property $states
	 * @since 0.1.0
	 * @hidden
	 */
	private [$states]: StateList = new StateList(this)

	/**
	 * @property $gestures
	 * @since 0.1.0
	 * @hidden
	 */
	private [$gestures]: GestureManager = new GestureManager(this)

	/**
	 * @property $children
	 * @since 0.1.0
	 * @hidden
	 */
	private [$children]: Array<View> = []

	/**
	 * @property $defaults
	 * @since 0.1.0
	 * @hidden
	 */
	private [$defaults]: any = {}

	/**
	 * @property $slot
	 * @since 0.1.0
	 * @hidden
	 */
	private [$slot]: Slot | null = null

	/**
	 * @property $root
	 * @since 0.1.0
	 * @hidden
	 */
	private [$root]: View | null = null

	/**
	 * @property $host
	 * @since 0.1.0
	 * @hidden
	 */
	private [$host]: View | null = null

	/**
	 * @property $lock
	 * @since 0.1.0
	 * @hidden
	 */
	private [$lock]: boolean = false

	//--------------------------------------------------------------------------
	// Native API
	//--------------------------------------------------------------------------

	/**
	 * @method nativeOnDestroy
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnDestroy() {
		this.emit('destroy')
	}

	/**
	 * @method nativeOnMoveToParent
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnMoveToParent(parent: View | null, former: View | null) {
		this.emit<ViewMoveToParentEvent>('movetoparent', { data: { parent, former } })
	}

	/**
	 * @method nativeOnMoveToWindow
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnMoveToWindow(window: Window | null, former: Window | null) {
		this.emit<ViewMoveToWindowEvent>('movetowindow', { data: { window, former } })
	}

	/**
	 * @method nativeOnScrollStart
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnScrollStart() {
		this.emit('scrollstart')
	}

	/**
	 * @method nativeOnScrollEnd
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnScrollEnd() {
		this.emit('scrollend')
	}

	/**
	 * @method nativeOnScroll
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnScroll() {
		this.emit('scroll')
	}

	/**
	 * @method nativeOnDragStart
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnDragStart() {
		this.emit('dragstart')
	}

	/**
	 * @method nativeOnDragEnd
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnDragEnd() {
		this.emit('dragend')
	}

	/**
	 * @method nativeOnDrag
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnDrag() {
		this.emit('drag')
	}

	/**
	 * @method nativeOnZoomStart
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnZoomStart() {
		this.emit('zoomstart')
	}

	/**
	 * @method nativeOnZoomEnd
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnZoomEnd(scale: number) {
		this.emit('zoomend', { data: { scale } })
	}

	/**
	 * @method nativeOnZoom
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnZoom() {
		this.emit('zoom')
	}

	/**
	 * @method nativeOnBeforeLayout
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnBeforeLayout() {
		this.emit('beforelayout')
	}

	/**
	 * @method nativeOnLayout
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnLayout() {
		this.emit('layout')
	}

	/**
	 * @method nativeOnRedraw
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnRedraw(canvas: Canvas) {
		this.emit<ViewRedrawEvent>('redraw', { data: { canvas } })
	}
}

/**
 * The default animation duration.
 * @const AnimationDefaultDuration
 * @since 0.1.0
 */
export const AnimationDefaultDuration = 350

/**
 * The default animation equation.
 * @const AnimationDefaultEquation
 * @since 0.1.0
 */
export const AnimationDefaultEquation = [0.25, 0.1, 0.25, 1.0]

/**
 * A registry of animation duration by name.
 * @const AnimationDurationRegistry
 * @since 0.1.0
 */
export const AnimationDurationRegistry: Map<string, number> = new Map()

/**
 * A registry of animation equation by name.
 * @const AnimationEquationRegistry
 * @since 0.1.0
 */
export const AnimationEquationRegistry: Map<string, Array<number>> = new Map()

/**
 * The view transition's options.
 * @interface ViewTransitionOptions
 * @since 0.1.0
 */
export interface ViewTransitionOptions {
	equation?: string | Array<number>
	duration?: string | number
	delay?: number
}

/**
 * The view transition's properties.
 * @type ViewTransitionProperties
 * @since 0.1.0
 */
export type ViewTransitionProperties<T> = {
	[P in keyof T]?: T[P]
}

/**
 * The view's insert event data.
 * @type ViewInsertEvent
 * @since 0.1.0
 */
export type ViewInsertEvent = {
	child: View
	index: number
}

/**
 * The view's remove event data.
 * @type ViewRemoveEvent
 * @since 0.1.0
 */
export type ViewRemoveEvent = {
	child: View
	index: number
}

/**
 * The view's move to parent event data.
 * @type ViewMoveToParentEvent
 * @since 0.1.0
 */
export type ViewMoveToParentEvent = {
	parent: View | null
	former: View | null
}

/**
 * The view's move to window event data.
 * @type ViewMoveToWindowEvent
 * @since 0.1.0
 */
export type ViewMoveToWindowEvent = {
	window: Window | null
	former: Window | null
}

/**
 * The view's redraw event data.
 * @type ViewRedrawEvent
 * @since 0.1.0
 */
export type ViewRedrawEvent = {
	canvas: Canvas
}
