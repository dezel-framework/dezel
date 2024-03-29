import { native } from 'native/native'
import { Application } from 'application/Application'
import { Event } from 'event/Event'
import { TouchEvent } from 'event/TouchEvent'
import { TouchList } from 'event/TouchList'
import { Canvas } from 'graphic/Canvas'
import { View } from 'view/View'
import { ViewMoveToParentEvent } from 'view/View'
import { ViewMoveToWindowEvent } from 'view/View'

describe('View', () => {

	let view: View

	beforeAll(() => {
		Application.register()
	})

	beforeEach(() => {
		view = new View()
	})

	it('should have a native object', () => {
		expect(native(view)).not.toBeUndefined()
	})

	it('should have a static native property', () => {
		expect(native(View)).not.toBeUndefined()
	})

	it('should have a valid initial id property value', () => {
		expect(view.id).toBe('')
	})

	it('should have a valid initial window property value', () => {
		expect(view.window).toBeNull()
	})

	it('should have a valid initial parent property value', () => {
		expect(view.parent).toBeNull()
	})

	it('should have a valid initial backgroundColor property value', () => {
		expect(view.backgroundColor).toBe('transparent')
	})

	it('should have a valid initial backgroundImage property value', () => {
		expect(view.backgroundImage).toBeNull()
	})

	it('should have a valid initial backgroundImageFit property value', () => {
		expect(view.backgroundImageFit).toBe('cover')
	})

	it('should have a valid initial backgroundImagePosition property value', () => {
		expect(view.backgroundImagePosition).toBe('center')
	})

	it('should have a valid initial border property value', () => {
		let border = view.border
		expect(border.width.top).toBe(0)
		expect(border.width.left).toBe(0)
		expect(border.width.right).toBe(0)
		expect(border.width.bottom).toBe(0)
		expect(border.color.top).toBe('#000')
		expect(border.color.left).toBe('#000')
		expect(border.color.right).toBe('#000')
		expect(border.color.bottom).toBe('#000')
	})

	it('should have a valid initial border width property value', () => {
		let borderWidth = view.borderWidth
		expect(borderWidth.top).toBe(0)
		expect(borderWidth.left).toBe(0)
		expect(borderWidth.right).toBe(0)
		expect(borderWidth.bottom).toBe(0)
	})

	it('should have a valid initial border color property value', () => {
		let borderColor = view.borderColor
		expect(borderColor.top).toBe('#000')
		expect(borderColor.left).toBe('#000')
		expect(borderColor.right).toBe('#000')
		expect(borderColor.bottom).toBe('#000')
	})

	it('should have a valid initial border top property value', () => {
		expect(view.borderTop).toBe('0 #000')
	})

	it('should have a valid initial border left property value', () => {
		expect(view.borderLeft).toBe('0 #000')
	})

	it('should have a valid initial border right property value', () => {
		expect(view.borderRight).toBe('0 #000')
	})

	it('should have a valid initial border bottom property value', () => {
		expect(view.borderBottom).toBe('0 #000')
	})

	it('should have a valid initial borderTopColor property value', () => {
		expect(view.borderTopColor).toBe('#000')
	})

	it('should have a valid initial borderTopColor property value', () => {
		expect(view.borderTopColor).toBe('#000')
	})

	it('should have a valid initial borderLeftColor property value', () => {
		expect(view.borderLeftColor).toBe('#000')
	})

	it('should have a valid initial borderRightColor property value', () => {
		expect(view.borderRightColor).toBe('#000')
	})

	it('should have a valid initial borderBottomColor property value', () => {
		expect(view.borderBottomColor).toBe('#000')
	})

	it('should have a valid initial borderTopWidth property value', () => {
		expect(view.borderTopWidth).toBe(0)
	})

	it('should have a valid initial borderLeftWidth property value', () => {
		expect(view.borderLeftWidth).toBe(0)
	})

	it('should have a valid initial borderRightWidth property value', () => {
		expect(view.borderRightWidth).toBe(0)
	})

	it('should have a valid initial borderBottomWidth property value', () => {
		expect(view.borderBottomWidth).toBe(0)
	})

	it('should have a valid initial minBorderTopWidth property value', () => {
		expect(view.minBorderTopWidth).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxBorderTopWidth property value', () => {
		expect(view.maxBorderTopWidth).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minBorderLeftWidth property value', () => {
		expect(view.minBorderLeftWidth).toBe(0)
	})

	it('should have a valid initial maxBorderLeftWidth property value', () => {
		expect(view.maxBorderLeftWidth).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minBorderRightWidth property value', () => {
		expect(view.minBorderRightWidth).toBe(0)
	})

	it('should have a valid initial maxBorderRightWidth property value', () => {
		expect(view.maxBorderRightWidth).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minBorderBottomWidth property value', () => {
		expect(view.minBorderBottomWidth).toBe(0)
	})

	it('should have a valid initial maxBorderBottomWidth property value', () => {
		expect(view.maxBorderBottomWidth).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial cornerTopLeftRadius property value', () => {
		expect(view.cornerTopLeftRadius).toBe(0)
	})

	it('should have a valid initial cornerTopRightRadius property value', () => {
		expect(view.cornerTopRightRadius).toBe(0)
	})

	it('should have a valid initial cornerBottomLeftRadius property value', () => {
		expect(view.cornerBottomLeftRadius).toBe(0)
	})

	it('should have a valid initial cornerBottomRightRadius property value', () => {
		expect(view.cornerBottomRightRadius).toBe(0)
	})

	it('should have a valid initial shadowBlur property value', () => {
		expect(view.shadowBlur).toBe(0)
	})

	it('should have a valid initial shadowColor property value', () => {
		expect(view.shadowColor).toBe('#000')
	})

	it('should have a valid initial shadowOffsetTop property value', () => {
		expect(view.shadowOffsetTop).toBe(0)
	})

	it('should have a valid initial shadowOffsetLeft property value', () => {
		expect(view.shadowOffsetLeft).toBe(0)
	})

	it('should have a valid initial top property value', () => {
		expect(view.top).toBe('auto')
	})

	it('should have a valid initial left property value', () => {
		expect(view.left).toBe('auto')
	})

	it('should have a valid initial right property value', () => {
		expect(view.right).toBe('auto')
	})

	it('should have a valid initial bottom property value', () => {
		expect(view.bottom).toBe('auto')
	})

	it('should have a valid initial minTop property value', () => {
		expect(view.minTop).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxTop property value', () => {
		expect(view.maxTop).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minLeft property value', () => {
		expect(view.minLeft).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxLeft property value', () => {
		expect(view.maxLeft).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minRight property value', () => {
		expect(view.minRight).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxRight property value', () => {
		expect(view.maxRight).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minBottom property value', () => {
		expect(view.minBottom).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxBottom property value', () => {
		expect(view.maxBottom).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial anchorTop property value', () => {
		expect(view.anchorTop).toBe(0)
	})

	it('should have a valid initial anchorLeft property value', () => {
		expect(view.anchorLeft).toBe(0)
	})

	it('should have a valid initial width property value', () => {
		expect(view.width).toBe('fill')
	})

	it('should have a valid initial height property value', () => {
		expect(view.height).toBe('fill')
	})

	it('should have a valid initial minWidth property value', () => {
		expect(view.minWidth).toBe(0)
	})

	it('should have a valid initial maxWidth property value', () => {
		expect(view.maxWidth).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minHeight property value', () => {
		expect(view.minHeight).toBe(0)
	})

	it('should have a valid initial maxHeight property value', () => {
		expect(view.maxHeight).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial expand property value', () => {
		expect(view.expandRatio).toBe(0)
	})

	it('should have a valid initial shrink property value', () => {
		expect(view.shrinkRatio).toBe(0)
	})

	it('should have a valid initial contentTop property value', () => {
		expect(view.contentTop).toBe(0)
	})

	it('should have a valid initial contentLeft property value', () => {
		expect(view.contentLeft).toBe(0)
	})

	it('should have a valid initial contentWidth property value', () => {
		expect(view.contentWidth).toBe('auto')
	})

	it('should have a valid initial contentHeight property value', () => {
		expect(view.contentHeight).toBe('auto')
	})

	it('should have a valid initial contentInsetTop property value', () => {
		expect(view.contentInsetTop).toBe(0)
	})

	it('should have a valid initial contentInsetLeft property value', () => {
		expect(view.contentInsetLeft).toBe(0)
	})

	it('should have a valid initial contentInsetRight property value', () => {
		expect(view.contentInsetRight).toBe(0)
	})

	it('should have a valid initial contentInsetBottom property value', () => {
		expect(view.contentInsetBottom).toBe(0)
	})

	it('should have a valid initial contentDirection property value', () => {
		expect(view.contentDirection).toBe('vertical')
	})

	it('should have a valid initial contentDisposition property value', () => {
		expect(view.contentDisposition).toBe('start')
	})

	it('should have a valid initial contentAlignment property value', () => {
		expect(view.contentAlignment).toBe('start')
	})

	it('should have a valid initial scrollable property value', () => {
		expect(view.scrollable).toBe(false)
	})

	it('should have a valid initial scrollbars property value', () => {
		expect(view.scrollbars).toBe(false)
	})

	it('should have a valid initial overscroll property value', () => {
		expect(view.overscroll).toBe('auto')
	})

	it('should have a valid initial scrollInertia property value', () => {
		expect(view.scrollInertia).toBe(true)
	})

	it('should have a valid initial scrollTop property value', () => {
		expect(view.scrollTop).toBe(0)
	})

	it('should have a valid initial scrollLeft property value', () => {
		expect(view.scrollLeft).toBe(0)
	})

	it('should have a valid initial scrolling property value', () => {
		expect(view.scrolling).toBe(false)
	})

	it('should have a valid initial dragging property value', () => {
		expect(view.dragging).toBe(false)
	})

	it('should have a valid initial margin property value', () => {
		let margin = view.margin
		expect(margin.top).toBe(0)
		expect(margin.left).toBe(0)
		expect(margin.right).toBe(0)
		expect(margin.bottom).toBe(0)
	})

	it('should have a valid initial marginTop property value', () => {
		expect(view.marginTop).toBe(0)
	})

	it('should have a valid initial marginLeft property value', () => {
		expect(view.marginLeft).toBe(0)
	})

	it('should have a valid initial marginRight property value', () => {
		expect(view.marginRight).toBe(0)
	})

	it('should have a valid initial marginBottom property value', () => {
		expect(view.marginBottom).toBe(0)
	})

	it('should have a valid initial minMarginTop property value', () => {
		expect(view.minMarginTop).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxMarginTop property value', () => {
		expect(view.maxMarginTop).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minMarginLeft property value', () => {
		expect(view.minMarginLeft).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxMarginLeft property value', () => {
		expect(view.maxMarginLeft).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minMarginRight property value', () => {
		expect(view.minMarginRight).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxMarginRight property value', () => {
		expect(view.maxMarginRight).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minMarginBottom property value', () => {
		expect(view.minMarginBottom).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxMarginBottom property value', () => {
		expect(view.maxMarginBottom).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial paddingTop property value', () => {
		expect(view.paddingTop).toBe(0)
	})

	it('should have a valid initial paddingLeft property value', () => {
		expect(view.paddingLeft).toBe(0)
	})

	it('should have a valid initial paddingRight property value', () => {
		expect(view.paddingRight).toBe(0)
	})

	it('should have a valid initial paddingBottom property value', () => {
		expect(view.paddingBottom).toBe(0)
	})

	it('should have a valid initial padding property value', () => {
		let padding = view.padding
		expect(padding.top).toBe(0)
		expect(padding.left).toBe(0)
		expect(padding.right).toBe(0)
		expect(padding.bottom).toBe(0)
	})

	it('should have a valid initial paddingTop property value', () => {
		expect(view.paddingTop).toBe(0)
	})

	it('should have a valid initial paddingLeft property value', () => {
		expect(view.paddingLeft).toBe(0)
	})

	it('should have a valid initial paddingRight property value', () => {
		expect(view.paddingRight).toBe(0)
	})

	it('should have a valid initial paddingBottom property value', () => {
		expect(view.paddingBottom).toBe(0)
	})

	it('should have a valid initial minPaddingTop property value', () => {
		expect(view.minPaddingTop).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxPaddingTop property value', () => {
		expect(view.maxPaddingTop).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minPaddingLeft property value', () => {
		expect(view.minPaddingLeft).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxPaddingLeft property value', () => {
		expect(view.maxPaddingLeft).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minPaddingRight property value', () => {
		expect(view.minPaddingRight).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxPaddingRight property value', () => {
		expect(view.maxPaddingRight).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial minPaddingBottom property value', () => {
		expect(view.minPaddingBottom).toBeLessThanOrEqual(Number.MIN_VALUE)
	})

	it('should have a valid initial maxPaddingBottom property value', () => {
		expect(view.maxPaddingBottom).toBeGreaterThanOrEqual(Number.MAX_VALUE)
	})

	it('should have a valid initial visible property value', () => {
		expect(view.visible).toBe(true)
	})

	it('should have a valid initial opacity property value', () => {
		expect(view.opacity).toBe(1)
	})

	it('should have a valid initial originX property value', () => {
		expect(view.originX).toBe(0.5)
	})

	it('should have a valid initial originY property value', () => {
		expect(view.originY).toBe(0.5)
	})

	it('should have a valid initial originZ property value', () => {
		expect(view.originZ).toBe(0)
	})

	it('should have a valid initial translationX property value', () => {
		expect(view.translationX).toBe(0)
	})

	it('should have a valid initial translationY property value', () => {
		expect(view.translationY).toBe(0)
	})

	it('should have a valid initial translationZ property value', () => {
		expect(view.translationZ).toBe(0)
	})

	it('should have a valid initial rotationX property value', () => {
		expect(view.rotationX).toBe(0)
	})

	it('should have a valid initial rotationY property value', () => {
		expect(view.rotationY).toBe(0)
	})

	it('should have a valid initial rotationZ property value', () => {
		expect(view.rotationZ).toBe(0)
	})

	it('should have a valid initial scaleX property value', () => {
		expect(view.scaleX).toBe(1)
	})

	it('should have a valid initial scaleY property value', () => {
		expect(view.scaleY).toBe(1)
	})

	it('should have a valid initial scaleZ property value', () => {
		expect(view.scaleZ).toBe(1)
	})

	it('should have a valid initial zIndex property value', () => {
		expect(view.zIndex).toBe(0)
	})

	it('should have a valid initial clipped property value', () => {
		expect(view.clipped).toBe(true)
	})

	it('should have a valid initial zoomable property value', () => {
		expect(view.zoomable).toBe(false)
	})

	it('should have a valid initial minZoom property value', () => {
		expect(view.minZoom).toBe(1.0)
	})

	it('should have a valid initial maxZoon property value', () => {
		expect(view.maxZoom).toBe(1.0)
	})

	it('should have a valid initial zoomedView property value', () => {
		expect(view.zoomedView).toBeNull()
	})

	it('should have a valid initial touchable property value', () => {
		expect(view.touchable).toBe(true)
	})

	it('should have a valid initial touchOffsetTop property value', () => {
		expect(view.touchOffsetTop).toBe(0)
	})

	it('should have a valid initial touchOffsetLeft property value', () => {
		expect(view.touchOffsetLeft).toBe(0)
	})

	it('should have a valid initial touchOffsetRight property value', () => {
		expect(view.touchOffsetRight).toBe(0)
	})

	it('should have a valid initial touchOffsetBottom property value', () => {
		expect(view.touchOffsetBottom).toBe(0)
	})

	it('should have a valid initial paged property value', () => {
		expect(view.paged).toBe(false)
	})

	it('should have a valid initial measuredWidth property value', () => {
		expect(view.measuredWidth).toBe(0)
	})

	it('should have a valid initial measuredHeight property value', () => {
		expect(view.measuredHeight).toBe(0)
	})

	it('should have a valid initial measuredInnerWidth property value', () => {
		expect(view.measuredInnerWidth).toBe(0)
	})

	it('should have a valid initial measuredInnerHeight property value', () => {
		expect(view.measuredInnerHeight).toBe(0)
	})

	it('should have a valid initial measuredContentWidth property value', () => {
		expect(view.measuredContentWidth).toBe(0)
	})

	it('should have a valid initial measuredContentHeight property value', () => {
		expect(view.measuredContentHeight).toBe(0)
	})

	it('should have a valid initial measuredMarginTop property value', () => {
		expect(view.measuredMarginTop).toBe(0)
	})

	it('should have a valid initial measuredMarginLeft property value', () => {
		expect(view.measuredMarginLeft).toBe(0)
	})

	it('should have a valid initial measuredMarginRight property value', () => {
		expect(view.measuredMarginRight).toBe(0)
	})

	it('should have a valid initial measuredMarginBottom property value', () => {
		expect(view.measuredMarginBottom).toBe(0)
	})

	it('should have a valid initial measuredPaddingTop property value', () => {
		expect(view.measuredMarginBottom).toBe(0)
	})

	it('should have a valid initial measuredPaddingLeft property value', () => {
		expect(view.measuredMarginBottom).toBe(0)
	})

	it('should have a valid initial measuredPaddingRight property value', () => {
		expect(view.measuredMarginBottom).toBe(0)
	})

	it('should have a valid initial measuredPaddingBottom property value', () => {
		expect(view.measuredMarginBottom).toBe(0)
	})

	it('should append a child view', () => {

		let v1 = new View()
		let v2 = new View()

		view.append(v1)
		view.append(v2)

		expect(view.children[0]).toBe(v1)
		expect(view.children[1]).toBe(v2)
	})

	it('should insert a child view', () => {

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()

		view.append(v1)
		view.append(v2)
		view.insert(v3, 1)

		expect(view.children[0]).toBe(v1)
		expect(view.children[1]).toBe(v3)
		expect(view.children[2]).toBe(v2)
	})

	it('should insert a child view in a valid range', () => {

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()
		let v4 = new View()

		view.append(v1)
		view.append(v2)
		view.insert(v3, -10)
		view.insert(v4, +10)

		expect(view.children[0]).toBe(v3)
		expect(view.children[1]).toBe(v1)
		expect(view.children[2]).toBe(v2)
		expect(view.children[3]).toBe(v4)

	})

	it('should set the child view parent when inserting', () => {

		let root = new View()

		let v1 = new View()
		let v2 = new View()

		root.append(v1)
		root.append(v2)
		view.append(v1)

		expect(v1.parent).toBe(view)
		expect(v2.parent).toBe(root)

	})

	it('should set child view responder when inserting', () => {

		let root = new View()

		let v1 = new View()
		let v2 = new View()

		root.append(v1)
		root.append(v2)
		view.append(v1)

		expect(v1.responder).toBe(view)
		expect(v2.responder).toBe(root)

	})

	it('should emit an event when inserting', () => {

		let fn1 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(v1)
			expect(event.data.index).toBe(0)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(v2)
			expect(event.data.index).toBe(1)
		})

		let v1 = new View()
		let v2 = new View()

		view.once('insert', fn1)
		view.append(v1)
		view.once('insert', fn2)
		view.append(v2)

		expect(fn1).toHaveBeenCalled()
		expect(fn2).toHaveBeenCalled()
	})

	it('should remove a child view', () => {

		let v1 = new View()
		let v2 = new View()

		view.append(v1)
		view.append(v2)

		view.remove(v1)
		view.remove(v2)

		expect(view.children[0]).toBeUndefined()
		expect(view.children[1]).toBeUndefined()
	})

	it('should remove itself from a parent view', () => {

		let v1 = new View()
		let v2 = new View()

		view.append(v1)
		view.append(v2)

		v1.removeFromParent()
		v2.removeFromParent()

		expect(view.children[0]).toBeUndefined()
		expect(view.children[1]).toBeUndefined()
	})

	it('should clear the child view parent when removing', () => {

		let v1 = new View()

		view.append(v1)
		view.remove(v1)

		expect(v1.parent).toBeNull()
	})

	it('should clear the child view responder when removing', () => {

		let v1 = new View()

		view.append(v1)
		view.remove(v1)

		expect(v1.responder).toBeNull()
	})

	it('should emit an event when removing', () => {

		let fn1 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(v1)
			expect(event.data.index).toBe(0)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(v2)
			expect(event.data.index).toBe(1)
		})

		let v1 = new View()
		let v2 = new View()

		view.append(v1)
		view.append(v2)

		view.once('remove', fn2)
		view.remove(v2)

		view.once('remove', fn1)
		view.remove(v1)

		expect(fn1).toHaveBeenCalled()
		expect(fn2).toHaveBeenCalled()
	})

	it('should remove all views', () => {

		let v1 = new View()
		let v2 = new View()

		view.append(v1)
		view.append(v2)

		view.empty()

		expect(view.children[0]).toBeUndefined()
		expect(view.children[1]).toBeUndefined()
	})

	it('should check if a view is contained inside another', () => {

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()
		let v4 = new View()

		view.append(v1)
		view.append(v2)

		v2.append(v3)
		v3.append(v4)

		expect(view.contains(v1)).toBe(true)
		expect(view.contains(v2)).toBe(true)
		expect(view.contains(v3)).toBe(true)
		expect(view.contains(v4)).toBe(true)
	})

	it('should set a style', () => {

		view.styles.append('style1')
		view.styles.remove('style1')
		view.styles.append('style2')

		expect(view.styles.has('style1')).toBe(false)
		expect(view.styles.has('style2')).toBe(true)
		expect(view.styles.has('style3')).toBe(false)
	})

	it('should set a state', () => {

		view.states.append('state1')
		view.states.remove('state1')
		view.states.append('state2')

		expect(view.states.has('state1')).toBe(false)
		expect(view.states.has('state2')).toBe(true)
		expect(view.states.has('state3')).toBe(false)
	})

	it('should call the native view scheduleRedraw method', () => {

		native(view).scheduleRedraw = jasmine.createSpy()
		view.scheduleRedraw()

		expect(native(view).scheduleRedraw).toHaveBeenCalled()
	})

	it('should call the native view scheduleLayout method', () => {

		native(view).scheduleLayout = jasmine.createSpy()
		view.scheduleLayout()

		expect(native(view).scheduleLayout).toHaveBeenCalled()
	})

	it('should call the native view measure method', () => {

		native(view).measureIfNeeded = jasmine.createSpy()
		view.measureIfNeeded()

		expect(native(view).measureIfNeeded).toHaveBeenCalled()
	})

	it('should call the native view resolve method', () => {

		native(view).resolveIfNeeded = jasmine.createSpy()
		view.resolveIfNeeded()

		expect(native(view).resolveIfNeeded).toHaveBeenCalled()
	})

	it('should call the native view scrollTo method', () => {

		native(view).scrollTo = jasmine.createSpy()
		view.scrollTo(0, 0)

		expect(native(view).scrollTo).toHaveBeenCalled()
	})

	it('should invoke the internal listeners', () => {

		let v = view as any

		v.onTouchCancel = jasmine.createSpy('onTouchCancel')
		v.onTouchStart = jasmine.createSpy('onTouchStart')
		v.onTouchMove = jasmine.createSpy('onTouchMove')
		v.onTouchEnd = jasmine.createSpy('onTouchEnd')
		v.onDestroy = jasmine.createSpy('onDestroy')
		v.onBeforeLayout = jasmine.createSpy('onBeforeLayout')
		v.onLayout = jasmine.createSpy('onLayout')
		v.onRedraw = jasmine.createSpy('onRedraw')
		v.onInsert = jasmine.createSpy('onInsert')
		v.onRemove = jasmine.createSpy('onRemove')
		v.onReady = jasmine.createSpy('onReady')
		v.onMoveToParent = jasmine.createSpy('onMoveToParent')
		v.onMoveToWindow = jasmine.createSpy('onMoveToWindow')
		v.onScrollStart = jasmine.createSpy('onScrollStart')
		v.onScrollEnd = jasmine.createSpy('onScrollEnd')
		v.onScroll = jasmine.createSpy('onScroll')
		v.onOverscroll = jasmine.createSpy('onOverscroll')
		v.onDragStart = jasmine.createSpy('onDragStart')
		v.onDragEnd = jasmine.createSpy('onDragEnd')
		v.onDrag = jasmine.createSpy('onDrag')
		v.onZoomStart = jasmine.createSpy('onZoomStart')
		v.onZoomEnd = jasmine.createSpy('onZoomEnd')
		v.onZoom = jasmine.createSpy('onZoom')

		let touchCancel = new TouchEvent('touchcancel', {
			propagable: true,
			cancelable: false,
			touches: new TouchList([]),
			activeTouches: new TouchList([]),
			targetTouches: new TouchList([]),
		})

		let touchStart = new TouchEvent('touchstart', {
			propagable: true,
			cancelable: true,
			touches: new TouchList([]),
			activeTouches: new TouchList([]),
			targetTouches: new TouchList([]),
		})

		let touchMove = new TouchEvent('touchmove', {
			propagable: true,
			cancelable: true,
			touches: new TouchList([]),
			activeTouches: new TouchList([]),
			targetTouches: new TouchList([]),
		})

		let touchEnd = new TouchEvent('touchend', {
			propagable: true,
			cancelable: false,
			touches: new TouchList([]),
			activeTouches: new TouchList([]),
			targetTouches: new TouchList([]),
		})

		let canvas = new Canvas()

		v.emit(touchCancel)
		v.emit(touchStart)
		v.emit(touchMove)
		v.emit(touchEnd)

		v.emit('destroy')
		v.emit('beforelayout')
		v.emit('layout')
		v.emit(new Event('redraw', { data: { canvas } }))
		v.emit(new Event('insert', { data: { child: view, index: 1 } }))
		v.emit(new Event('remove', { data: { child: view, index: 1 } }))
		v.emit(new Event('movetoparent', { data: { parent: view, former: null } }))
		v.emit(new Event('movetowindow', { data: { window: view, former: null } }))
		v.emit('ready')
		v.emit('scrollstart')
		v.emit('scrollend')
		v.emit('scroll')
		v.emit('overscroll')
		v.emit('dragstart')
		v.emit('dragend')
		v.emit('drag')
		v.emit('zoomstart')
		v.emit('zoomend')
		v.emit('zoom')

		expect(v.onDestroy).toHaveBeenCalled()
		expect(v.onBeforeLayout).toHaveBeenCalled()
		expect(v.onLayout).toHaveBeenCalled()
		expect(v.onRedraw).toHaveBeenCalledWith(canvas)
		expect(v.onInsert).toHaveBeenCalledWith(view, 1)
		expect(v.onRemove).toHaveBeenCalledWith(view, 1)
		expect(v.onMoveToParent).toHaveBeenCalledWith(view, null)
		expect(v.onMoveToWindow).toHaveBeenCalledWith(view, null)
		expect(v.onScrollStart).toHaveBeenCalled()
		expect(v.onScrollEnd).toHaveBeenCalled()
		expect(v.onScroll).toHaveBeenCalled()
		expect(v.onOverscroll).toHaveBeenCalled()
		expect(v.onDragStart).toHaveBeenCalled()
		expect(v.onDragEnd).toHaveBeenCalled()
		expect(v.onDrag).toHaveBeenCalled()
		expect(v.onZoomStart).toHaveBeenCalled()
		expect(v.onZoomEnd).toHaveBeenCalled()
		expect(v.onZoom).toHaveBeenCalled()
	})

	it('should invoke onMoveToParent', () => {

		let fn1 = jasmine.createSpy().and.callFake((event: Event<ViewMoveToParentEvent>) => {
			expect(event.data.parent).toBe(application.window)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event<ViewMoveToParentEvent>) => {
			expect(event.data.parent).toBe(null)
		})

		let application = Application.register()

		let v1 = new View()

		v1.once('movetoparent', fn1)
		application.window.append(v1)

		v1.once('movetoparent', fn2)
		application.window.remove(v1)

		expect(fn1).toHaveBeenCalledTimes(1)
		expect(fn2).toHaveBeenCalledTimes(1)
	})

	it('should invoke onMoveToWindow', () => {

		let fn1 = jasmine.createSpy().and.callFake((event: Event<ViewMoveToWindowEvent>) => {
			expect(event.data.window).toBe(application.window)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event<ViewMoveToWindowEvent>) => {
			expect(event.data.window).toBe(null)
		})

		let application = Application.register()
		application.window.id = 'WAT'

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()

		v1.id = "v1"
		v2.id = "v2"
		v3.id = "v3"

		v1.once('movetowindow', fn1)
		v2.once('movetowindow', fn1)
		v3.once('movetowindow', fn1)

		v1.append(v2)
		v2.append(v3)

		application.window.append(v1)

		v1.once('movetowindow', fn2)
		v2.once('movetowindow', fn2)
		v3.once('movetowindow', fn2)

		application.window.remove(v1)

		expect(fn1).toHaveBeenCalledTimes(3)
		expect(fn1).toHaveBeenCalledTimes(3)
	})

	it('should invoke onBeforeLayout', () => {

		let fn1 = jasmine.createSpy()

		let application = Application.register()

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()

		v1.once('beforelayout', fn1)
		v2.once('beforelayout', fn1)
		v3.once('beforelayout', fn1)

		v1.append(v2)
		v2.append(v3)

		application.window.append(v1)

		application.window.resolveIfNeeded()

		expect(fn1).toHaveBeenCalledTimes(3)
	})

	it('should invoke onLayout', () => {

		let fn1 = jasmine.createSpy()

		let application = Application.register()

		let v1 = new View()
		let v2 = new View()
		let v3 = new View()

		v1.once('layout', fn1)
		v2.once('layout', fn1)
		v3.once('layout', fn1)

		v1.append(v2)
		v2.append(v3)

		application.window.append(v1)

		application.window.resolveIfNeeded()

		expect(fn1).toHaveBeenCalledTimes(2) // Last view is empty, no layout needed
	})

})