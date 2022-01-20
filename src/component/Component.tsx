import { $content } from 'component/symbol/Component'
import { $damaged } from 'component/symbol/Component'
import { $invalid } from 'component/symbol/Component'
import { $rendering } from 'component/symbol/Component'
import { $slots } from 'component/symbol/Component'
import { $children } from 'view/symbol/View'
import { $host } from 'view/symbol/View'
import { $lock } from 'view/symbol/View'
import { $root } from 'view/symbol/View'
import { appendChild } from 'component/private/Component'
import { canInsert } from 'component/private/Component'
import { canRemove } from 'component/private/Component'
import { insertChild } from 'component/private/Component'
import { removeChild } from 'component/private/Component'
import { renderChild } from 'component/private/Component'
import { scheduleRender } from 'component/rendering/render'
import { setHost } from 'view/private/View'
import { setRoot } from 'view/private/View'
import { Body } from 'component/Body'
import { Event } from 'event/Event'
import { Descriptor } from 'type/Descriptor'
import { View } from 'view/View'

/**
 * @class Component
 * @super Emitter
 * @since 0.1.0
 */
export abstract class Component extends View {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The view's children.
	 * @property children
	 * @since 0.1.0
	 */
	public get children(): ReadonlyArray<View> {
		return this[$children]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Renders the component.
	 * @method render
	 * @since 0.1.0
	 */
	public render(): Descriptor<Body | View> | null {
		return null
	}

	/**
	 * Schedule a render on the next frame.
	 * @method scheduleRender
	 * @since 0.1.0
	 */
	public scheduleRender() {
		scheduleRender(this)
		return this
	}

	/**
	 * @inherited
	 * @method append
	 * @since 0.1.0
	 */
	public append(child: View, slot: string | null = null) {

		if (this[$rendering]) {
			return super.append(child)
		}

		if (child[$lock]) {
			return super.append(child)
		}

		canInsert(this, child, slot)

		if (child[$lock] == false) {

			let host = child[$host]
			if (host) {
				host.remove(child)
			}

			setHost(child, this)
			setRoot(child, this[$root])

			child[$lock] = true
		}

		renderChild(this, child)
		appendChild(this, child, slot)

		child[$lock] = false

		return this
	}

	/**
	 * @inherited
	 * @method insert
	 * @since 0.1.0
	 */
	public insert(child: View, index: number, slot: string | null = null) {

		if (this[$rendering]) {
			return super.insert(child, index)
		}

		if (child[$lock] &&
			child[$host] == this) {
			return super.insert(child, index)
		}

		canInsert(this, child, slot)

		if (child[$lock] == false) {

			let host = child[$host]
			if (host) {
				host.remove(child)
			}

			setHost(child, this)
			setRoot(child, this[$root])

			child[$lock] = true
		}

		renderChild(this, child)
		insertChild(this, child, index, slot)

		child[$lock] = false

		return this
	}

	/**
	 * @inherited
	 * @method remove
	 * @since 0.1.0
	 */
	public remove(child: View, slot: string | null = null) {

		if (this[$rendering]) {
			return super.append(child)
		}

		if (child[$lock] &&
			child[$host] == this) {
			return super.remove(child)
		}

		canRemove(this, child)

		if (child[$lock] == false) {

			setHost(child, null)
			setRoot(child, null)

			child[$lock] = true
		}

		renderChild(this, child)
		removeChild(this, child)

		child[$lock] = false

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

		switch (event.type) {

			case 'create':
				this.onCreate()
				break

			case 'render':
				this.onRender()
				break

			case 'insert':
				this.onInsert(event.data.child, event.data.index)
				break

			case 'remove':
				this.onRemove(event.data.child, event.data.index)
				break

			case 'destroy':
				this.onDestroy()
				break
		}
	}

	/**
	 * Called the first time the component is rendered.
	 * @method onCreate
	 * @since 0.1.0
	 */
	public onCreate() {

	}

	/**
	 * Called when the component is rendered.
	 * @method onRender
	 * @since 0.1.0
	 */
	public onRender() {

	}

	/**
	 * @method onPropertyChange
	 * @since 0.1.0
	 * @inherited
	 */
	public onPropertyChange(property: string, newValue: any, oldValue: any) {

	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $slots
	 * @since 0.1.0
	 * @hidden
	 */
	private [$slots]: any = {}

	/**
	 * @property $content
	 * @since 0.1.0
	 * @hidden
	 */
	private [$content]: Descriptor | null = null

	/**
	 * @property $invalid
	 * @since 0.1.0
	 * @hidden
	 */
	private [$invalid]: boolean = true

	/**
	 * @property $damaged
	 * @since 0.1.0
	 * @hidden
	 */
	private [$damaged]: boolean = false

	/**
	 * @property $rendering
	 * @since 0.1.0
	 * @hidden
	 */
	private [$rendering]: boolean = false
}
