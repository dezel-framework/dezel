import { Data } from 'data/Data'
import { DataInsertEvent } from 'data/Data'
import { DataReloadEvent } from 'data/Data'
import { DataRemoveEvent } from 'data/Data'
import { DataUpdateEvent } from 'data/Data'
import { bound } from 'decorator/bound'
import { $responder } from 'event/symbol/Emitter'
import { Emitter } from 'event/Emitter'
import { Event } from 'event/Event'
import { bridge } from 'native/bridge'
import { native } from 'native/native'
import { $collection } from 'view/symbol/Recycler'
import { $data } from 'view/symbol/Recycler'
import { $getViewType } from 'view/symbol/Recycler'
import { $onInsertView } from 'view/symbol/Recycler'
import { $onRemoveView } from 'view/symbol/Recycler'
import { $target } from 'view/symbol/Collection'
import { $view } from 'view/symbol/Recycler'
import { insertView } from 'view/private/Recycler'
import { removeView } from 'view/private/Recycler'
import { Collection } from 'view/Collection'
import { View } from 'view/View'
import { ViewInsertEvent } from 'view/View'
import { ViewMoveToParentEvent } from 'view/View'
import { ViewMoveToWindowEvent } from 'view/View'
import { ViewRemoveEvent } from 'view/View'

// TODO
// Comments

@bridge('dezel.view.Recycler')

/**
 * @class Recycler
 * @super Emitter
 * @since 0.1.0
 */
export class Recycler<T> extends Emitter {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * @property animated
	 * @since 0.1.0
	 */
	public animated: boolean = true

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * Initializes the recycler.
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(collection: Collection, data: Data<T>, options: RecyclerOptions<T>) {

		super()

		let view = collection[$target]

		this[$data] = data
		this[$view] = view
		this[$collection] = collection
		this[$getViewType] = options.getViewType
		this[$onInsertView] = options.onInsertView
		this[$onRemoveView] = options.onRemoveView

		this[$data].on('reload', this.onDataReload)
		this[$data].on('insert', this.onDataInsert)
		this[$data].on('remove', this.onDataRemove)
		this[$data].on('modify', this.onDataModify)
		this[$data].on('update', this.onDataUpdate)
		this[$data].on('commit', this.onDataCommit)

		view = native(view)

		native(this).attach(
			view,
			data.length
		)
	}

	/**
	 * Destroys the recycler.
	 * @method destroy
	 * @since 0.1.0
	 */
	public destroy() {

		native(this).detach()

		this[$data].off('reload', this.onDataReload)
		this[$data].off('insert', this.onDataInsert)
		this[$data].off('remove', this.onDataRemove)
		this[$data].off('modify', this.onDataModify)
		this[$data].off('update', this.onDataUpdate)
		this[$data].off('commit', this.onDataCommit)
		this[$data].destroy()

		return super.destroy()
	}

	/**
	 * Resets the recycler.
	 * @method reset
	 * @since 0.1.0
	 */
	public reset() {
		native(this).reset()
		return this
	}

	//--------------------------------------------------------------------------
	// Events
	//--------------------------------------------------------------------------

	/**
	 * Called when the recycler's data is reloaded.
	 * @method onReloadData
	 * @since 0.1.0
	 */
	public onReloadData(event: Event<DataReloadEvent<T>>) {

	}

	/**
	 * Called when data is inserted.
	 * @method onInsertData
	 * @since 0.1.0
	 */
	public onInsertData(event: Event<DataInsertEvent<T>>) {
		native(this).insertData(
			event.data.index,
			event.data.items.length,
			this.animated
		)
	}

	/**
	 * Called when data is removed.
	 * @method onRemoveData
	 * @since 0.1.0
	 */
	public onRemoveData(event: Event<DataRemoveEvent<T>>) {
		native(this).removeData(
			event.data.index,
			event.data.items.length,
			this.animated
		)
	}

	/**
	 * Called when a group of data is about to be updated.
	 * @method onModifyData
	 * @since 0.1.0
	 */
	public onModifyData(event: Event) {
		//	this.batching = true
	}

	/**
	 * Called when data is updated.
	 * @method onUpdateData
	 * @since 0.1.0
	 */
	public onUpdateData(event: Event<DataUpdateEvent<T>>) {

		let index = event.data.index
		let value = event.data.value

		let item = this[$collection].get(index)
		if (item) {
			this[$onRemoveView].call(null, index, value, item)
			this[$onInsertView].call(null, index, value, item)
		}
	}

	/**
	 * Called when a group of data has been updated.
	 * @method onCommitData
	 * @since 0.1.0
	 */
	public onCommitData(event: Event) {
		// this.batching = false

		// if (this.animate) {
		// 	this.performTransition()
		// }
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $data
	 * @since 0.1.0
	 * @hidden
	 */
	private [$view]: View

	/**
	 * @property $data
	 * @since 0.1.0
	 * @hidden
	 */
	private [$data]: Data<T>

	/**
	 * @property $collection
	 * @since 0.1.0
	 * @hidden
	 */
	private [$collection]: Collection

	/**
	 * @property $onInsertView
	 * @since 0.1.0
	 * @hidden
	 */
	private [$getViewType]: GetViewType<T>

	/**
	 * @property $onInsertView
	 * @since 0.1.0
	 * @hidden
	 */
	private [$onInsertView]: OnInsertView<T>

	/**
	 * @property $onRemoveView
	 * @since 0.1.0
	 * @hidden
	 */
	private [$onRemoveView]: OnRemoveView<T>

	/**
	 * @method onDataReload
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataReload(event: Event<DataReloadEvent<T>>) {
		this.onReloadData(event)
	}

	/**
	 * @method onDataInsert
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataInsert(event: Event<DataInsertEvent<T>>) {
		this.onInsertData(event)
	}

	/**
	 * @method onDataRemove
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataRemove(event: Event<DataRemoveEvent<T>>) {
		this.onRemoveData(event)
	}

	/**
	 * @method onDataModify
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataModify(event: Event) {
		this.onModifyData(event)
	}

	/**
	 * @method onDataUpdate
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataUpdate(event: Event<DataUpdateEvent<T>>) {
		this.onUpdateData(event)
	}

	/**
	 * @method onDataCommit
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDataCommit(event: Event) {
		this.onCommitData(event)
	}

	//--------------------------------------------------------------------------
	// Native API
	//--------------------------------------------------------------------------

	/**
	 * @method nativeGetViewType
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeGetViewType(index: number) {

		let value = this[$data].get(index)
		if (value == null) {
			throw new Error('Unexpected error.')
		}

		return this[$getViewType].call(null, index, value)
	}

	/**
	 * @method nativeOnInsertView
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnInsertView(index: number, child: View) {

		let value = this[$data].get(index)
		if (value == null) {
			throw new Error('Unexpected error.')
		}

		let parent = this[$view]
		let window = this[$view].window

		insertView(this, child, index)

		child[$responder] = parent

		child.emit<ViewMoveToParentEvent>('movetoparent', { data: { parent, former: null } })
		child.emit<ViewMoveToWindowEvent>('movetowindow', { data: { window, former: null } })

		parent.emit<ViewInsertEvent>('insert', { data: { child, index } })

		this[$onInsertView].call(null, index, value, child)
	}

	/**
	 * @method nativeOnRemoveItem
	 * @since 0.1.0
	 * @hidden
	 */
	private nativeOnRemoveView(index: number, child: View) {

		let value = this[$data].get(index)
		if (value == null) {
			throw new Error('Unexpected error.')
		}

		let parent = this[$view]
		let window = this[$view].window

		this[$onRemoveView].call(null, index, value, child)

		parent.emit<ViewRemoveEvent>('remove', { data: { child, index } })

		child.emit<ViewMoveToParentEvent>('movetoparent', { data: { parent: null, former: parent } })
		child.emit<ViewMoveToWindowEvent>('movetowindow', { data: { window: null, former: window } })

		child[$responder] = null

		removeView(this, child, index)
	}
}

/**
 * @interface RecyclerOptions
 * @since 0.1.0
 */
export interface RecyclerOptions<T> {
	estimatedItemSize: number
	getViewType: GetViewType<T>
	onInsertView: OnInsertView<T>
	onRemoveView: OnRemoveView<T>
}

/**
 * The view type callback data.
 * @type GetViewType
 * @since 0.1.0
 */
export type GetViewType<T> = (index: number, data: T) => void

/**
 * The insert view callback data.
 * @type OnInsertView
 * @since 0.1.0
 */
export type OnInsertView<T> = (index: number, data: T, view: View) => void

/**
 * The remove view callback data.
 * @type OnRemoveView
 * @since 0.1.0
 */
export type OnRemoveView<T> = (index: number, data: T, view: View) => void