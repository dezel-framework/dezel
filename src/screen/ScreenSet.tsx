import { $dismissing } from './symbol/Screen'
import { $frame } from './symbol/Screen'
import { $presented } from './symbol/Screen'
import { $presenter } from './symbol/Screen'
import { $presenting } from './symbol/Screen'
import { $screens } from './symbol/ScreenSet'
import { $selectedIndex } from './symbol/ScreenSet'
import { $selectedValue } from './symbol/ScreenSet'
import { watch } from '../decorator/watch'
import { emitBeforeEnter } from './private/Screen'
import { emitBeforePresent } from './private/Screen'
import { emitEnter } from './private/Screen'
import { emitPresent } from './private/Screen'
import { presentScreenAsync } from './private/Screen'
import { getSelectedScreen } from './private/ScreenSet'
import { getSelectedSegue } from './private/ScreenSet'
import { selectScreenAsync } from './private/ScreenSet'
import { Event } from '../event/Event'
import { Screen } from './Screen'
import { Segue } from './Segue'
import './style/ScreenSet.style'
import './style/ScreenSet.style.android'
import './style/ScreenSet.style.ios'

/**
 * @class ScreenSet
 * @super Screen
 * @since 0.1.0
 */
export class ScreenSet extends Screen {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The screen set's screen types.
	 * @property screens
	 * @since 0.1.0
	 */
	@watch public screens: Array<ScreenType> = []

	/**
	 * The screen set's selected index.
	 * @property selectedIndex
	 * @since 0.1.0
	 */
	public get selectedIndex(): number | null {
		return this[$selectedIndex]
	}

	/**
	 * The screen set's selected screen.
	 * @property selectedScreen
	 * @since 0.1.0
	 */
	public get selectedScreen(): Screen | null {
		return this[$selectedValue]
	}

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method select
	 * @since 0.1.0
	 */
	public render() {
		return null
	}

	/**
	 * Selects a screen with a segue.
	 * @method select
	 * @since 0.1.0
	 */
	public select(index: number, using: Segue | string = 'static'): Promise<void> {

		if (this.selectedIndex == index) {
			return Promise.resolve()
		}

		let event = new Event<ScreenSetBeforeSelectEvent>('beforeselect', {
			cancelable: true,
			propagable: false,
			data: {
				index
			}
		})

		this.emit(event)

		if (event.canceled) {
			return Promise.resolve()
		}

		let screen = getSelectedScreen(this, index)

		if (screen.presenting ||
			screen.dismissing) {
			return Promise.resolve()
		}

		if (this.presenting) {
			throw new Error(`ScreenSet error: This screen is being presented.`)
		}

		let dismissedScreen = this.selectedScreen
		let presenterScreen = this
		let presentedScreen = screen

		let presentedScreenSegue = getSelectedSegue(this, using)

		this[$screens][index] = screen

		this[$selectedIndex] = index
		this[$selectedValue] = screen

		if (dismissedScreen == null) {

			presenterScreen.append(screen[$frame])

			presentedScreen.updateStatusBar()

			emitBeforePresent(presentedScreen, presentedScreenSegue)
			emitBeforeEnter(presentedScreen, presentedScreenSegue)
			emitPresent(presentedScreen, presentedScreenSegue)
			emitEnter(presentedScreen, presentedScreenSegue)

			presentedScreen[$presented] = true
			presentedScreen[$presenter] = this

			return Promise.resolve()
		}

		presenterScreen[$presenting] = true
		dismissedScreen[$dismissing] = true

		return selectScreenAsync(
			this,
			presentedScreen,
			dismissedScreen,
			presentedScreenSegue
		)
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

			case 'select':
				this.onSelect(event)
				break

			case 'deselect':
				this.onDeselect(event)
				break
		}

		if (this.presented) {

			let screen = this.selectedScreen
			if (screen == null) {
				return
			}

			switch (event.type) {
				case 'beforepresent':
				case 'beforedismiss':
				case 'present':
				case 'dismiss':
				case 'beforeenter':
				case 'beforeleave':
				case 'enter':
				case 'leave':
					screen.onEvent(event)
					break
			}
		}
	}

	/**
	 * Called before a screen is selected.
	 * @method onBeforeSelect
	 * @since 0.1.0
	 */
	public onBeforeSelect(event: Event<ScreenSetSelectEvent>) {

	}

	/**
	 * Called when a screen is selected.
	 * @method onSelect
	 * @since 0.1.0
	 */
	public onSelect(event: Event<ScreenSetSelectEvent>) {

	}

	/**
	 * Called when a screen is deselected.
	 * @method onDeselect
	 * @since 0.1.0
	 */
	public onDeselect(event: Event<ScreenSetDeselectEvent>) {

	}

	/**
	 * @inherited
	 * @method onLowMemory
	 * @since 0.1.0
	 */
	public onLowMemory() {

		/*
		 * Disposes all the screens except the one being displayed. This
		 * should free enough memory.
		 */

		let screens = this[$screens].slice()

		for (let i = 0; i < screens.length; i++) {

			let screen = screens[i]
			if (screen == this.selectedScreen) {
				continue
			}

			screen.dispose()

			this[$screens].splice(i, 1)
		}
	}

	/**
	 * @inherited
	 * @method onBack
	 * @since 0.1.0
	 */
	public onBack(event: Event) {

		let presentedScreen = this.presentee
		if (presentedScreen) {
			presentedScreen.emit(event)
			if (event.canceled) {
				return
			}
		}

		let selectedScreen = this.selectedScreen
		if (selectedScreen &&
			selectedScreen.presentee) {
			selectedScreen.presentee.emit(event)
			if (event.canceled) {
				return
			}
		}

		if (this.presenter == null) {
			return
		}

		event.cancel()

		this.dismiss()
	}

	/**
	 * @inherited
	 * @method onPropertyChange
	 * @since 0.1.0
	 */
	public onPropertyChange(property: string, newValue: any, oldValue: any) {

		if (property == 'screens') {
			this[$screens].forEach(screen => screen.dispose())
			this[$screens] = []
		}

		super.onPropertyChange(property, newValue, oldValue)
	}

	//--------------------------------------------------------------------------
	// Internal API
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @method updateStatusBar
	 * @since 0.1.0
	 */
	public updateStatusBar() {

		if (this.selectedScreen) {
			this.selectedScreen.updateStatusBar()
			return
		}

		super.updateStatusBar()
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property $screens
	 * @since 0.1.0
	 * @hidden
	 */
	private [$screens]: Array<Screen> = []

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
	private [$selectedValue]: Screen | null = null
}

/**
 * @interface ScreenType
 * @since 0.1.0
 */
export type ScreenType = {
	new(): Screen
}

/**
 * @type ScreenSetBeforeSelectEvent
 * @since 0.1.0
 */
export type ScreenSetBeforeSelectEvent = {
	index: number
}

/**
 * @type ScreenSetSelectEvent
 * @since 0.1.0
 */
export type ScreenSetSelectEvent = {
	index: number
}

/**
 * @type ScreenSetSelectEvent
 * @since 0.1.0
 */
export type ScreenSetDeselectEvent = {
	index: number
}