import { $frame } from 'screen/symbol/Screen'
import { $modal } from 'screen/symbol/Screen'
import { $presented } from 'screen/symbol/Screen'
import { $presentee } from 'screen/symbol/Screen'
import { $presenter } from 'screen/symbol/Screen'
import { $presenting } from 'screen/symbol/Screen'
import { $style } from 'screen/symbol/Screen'
import { $screen } from 'segue/symbol/Segue'
import { getRegisteredSegue } from 'segue/private/Segue'
import { insertAfter } from 'view/private/View'
import { getCurrentScreen } from 'view/private/Window'
import { Screen } from 'screen/Screen'
import { ScreenBeforeDismissEvent } from 'screen/Screen'
import { ScreenBeforeEnterEvent } from 'screen/Screen'
import { ScreenBeforeLeaveEvent } from 'screen/Screen'
import { ScreenBeforePresentEvent } from 'screen/Screen'
import { ScreenDismissOptions } from 'screen/Screen'
import { ScreenEnterEvent } from 'screen/Screen'
import { ScreenLeaveEvent } from 'screen/Screen'
import { ScreenPresentEvent } from 'screen/Screen'
import { ScreenPresentOptions } from 'screen/Screen'
import { Segue } from 'segue/Segue'

/**
 * @function isModal
 * @since 0.1.0
 * @hidden
 */
export function isModal(screen: Screen) {
	return screen[$modal]
}

/**
 * @function isOverlay
 * @since 0.1.0
 * @hidden
 */
export function isOverlay(screen: Screen) {
	return screen[$style] == 'overlay'
}

/**
 * @function isPopover
 * @since 0.1.0
 * @hidden
 */
export function isPopover(screen: Screen) {
	return screen[$style] == 'popover'
}

/**
 * @function getSegue
 * @since 0.1.0
 * @hidden
 */
export function getSegue(screen: Screen, segue: Segue | string | null) {
	return typeof segue == 'string' ? getRegisteredSegue(segue) : segue
}

/**
 * @function getPresentSegue
 * @since 0.1.0
 * @hidden
 */
export function getPresentSegue(screen: Screen, using: Segue | string | null) {

	let segue = getSegue(screen, using) || screen.segue
	if (segue == null) {
		throw new Error(`Screen error: This screen does not have a segue.`)
	}

	if (segue.screen == screen) {
		return segue
	}

	/*
	 * It's possible to assign a segue that is used by a screen. Throw an
	 * error immediately to prevent undefined behavior.
	 */

	if (segue.screen) {
		throw new Error(`Screen error: This segue is already bound to a screen.`)
	}

	segue[$screen] = screen

	segue.configure()

	return segue
}

/**
 * @function getDismissSegue
 * @since 0.1.0
 * @hidden
 */
export function getDismissSegue(screen: Screen, using: Segue | string | null) {

	let segue = getSegue(screen, using) || screen.segue
	if (segue == null) {
		throw new Error(`Screen error: This screen does not have a segue.`)
	}

	if (segue.screen == screen) {
		return segue
	}

	if (segue.screen) {
		throw new Error(`Screen error: This segue is already bound to a screen.`)
	}

	segue[$screen] = screen

	segue.configure()

	return segue
}

/**
 * @method insertScreen
 * @since 0.1.0
 * @hidden
 */
export function insertScreen(screen: Screen, presentedScreen: Screen, dismissedScreen: Screen, modal: boolean) {

	let dismissedScreenFrame = dismissedScreen[$frame]
	let presentedScreenFrame = presentedScreen[$frame]

	if (modal) {

		let window = screen.window
		if (window == null) {
			return
		}

		insertAfter(
			window,
			presentedScreenFrame,
			dismissedScreenFrame
		)

	} else {

		let parent = screen.parent
		if (parent == null) {
			return
		}

		insertAfter(
			parent,
			presentedScreenFrame,
			dismissedScreen
		)

	}
}

/**
 * @method presentScreenAsync
 * @since 0.1.0
 * @hidden
 */
export function presentScreenAsync(screen: Screen, present: Screen, dismiss: Screen, segue: Segue, options: ScreenPresentOptions): Promise<void> {
	return new Promise(success => {
		requestAnimationFrame(() => presentScreen(screen, present, dismiss, segue, options, success))
	})
}

/**
 * @method dismissScreenAsync
 * @since 0.1.0
 * @hidden
 */
export function dismissScreenAsync(screen: Screen, present: Screen, segue: Segue, options: ScreenDismissOptions): Promise<void> {
	return new Promise(success => {
		requestAnimationFrame(() => dismissScreen(screen, present, segue, options, success))
	})
}

/**
 * @method presentScreen
 * @since 0.1.0
 * @hidden
 */
export async function presentScreen(screen: Screen, present: Screen, dismiss: Screen, segue: Segue, options: ScreenPresentOptions, done: () => void) {

	try {

		let window = screen.window!

		window.touchable = false

		let presenterScreen = screen
		let presentedScreen = present
		let dismissedScreen = dismiss

		presenterScreen[$presentee] = presentedScreen
		presentedScreen[$presenter] = presenterScreen

		let modal = isModal(presentedScreen)
		if (modal) {
			dismissedScreen = getCurrentScreen(window)
		}

		insertScreen(
			presenterScreen,
			presentedScreen,
			dismissedScreen,
			modal
		)

		presentedScreen.visible = true

		presentedScreen.resolveIfNeeded()

		segue.onBeforePresent(
			presentedScreen,
			dismissedScreen
		)

		await emitBeforeLeave(dismissedScreen, segue)
		await emitBeforePresent(presentedScreen, segue)
		await emitBeforeEnter(presentedScreen, segue)

		presentedScreen.updateStatusBar()

		await segue.present(
			presentedScreen,
			dismissedScreen
		)

		segue.onAfterPresent(
			presentedScreen,
			dismissedScreen
		)

		dismissedScreen.visible = isOverlay(presentedScreen)

		await emitLeave(dismissedScreen, segue)
		await emitPresent(presentedScreen, segue)
		await emitEnter(presentedScreen, segue)

		presentedScreen[$presented] = true
		dismissedScreen[$presented] = false
		presentedScreen[$presenting] = false
		dismissedScreen[$presenting] = false

		window.touchable = true

		done()

	} catch (e) {
		console.error(e)
	}
}

/**
 * @method dismissScreen
 * @since 0.1.0
 * @hidden
 */
export async function dismissScreen(screen: Screen, dismiss: Screen, segue: Segue, options: ScreenDismissOptions, done: () => void) {

	try {

		let window = screen.window!

		window.touchable = false

		let target = getDismissTarget(dismiss)

		let dismisserScreen = screen
		let dismissedScreen = target
		let presentedScreen = screen.presenter

		if (presentedScreen == null) {
			throw new Error(`Screen error: This screen has no presenter screen.`)
		}

		let destroy = options.destroy || false

		presentedScreen.visible = true

		presentedScreen.resolveIfNeeded()

		segue.onBeforeDismiss(
			presentedScreen,
			dismissedScreen
		)

		await emitBeforeLeave(dismissedScreen, segue)
		await emitBeforeEnter(presentedScreen, segue)

		emitBeforeLeaveChain(
			dismissedScreen,
			dismisserScreen,
			segue
		)

		dismissedScreen.emit('done')
		presentedScreen.updateStatusBar()

		await segue.dismiss(
			presentedScreen,
			dismissedScreen
		)

		segue.onAfterDismiss(
			presentedScreen,
			dismissedScreen
		)

		await emitLeave(dismissedScreen, segue)
		await emitDismiss(dismissedScreen, segue)
		await emitEnter(presentedScreen, segue)

		emitLeaveChain(
			dismissedScreen,
			dismisserScreen,
			segue
		)

		emitDismissChain(
			dismissedScreen,
			dismisserScreen,
			segue
		)

		dismissedScreen.dispose(destroy)

		disposeChain(
			dismissedScreen,
			dismisserScreen,
			destroy
		)

		presentedScreen[$presented] = true
		dismissedScreen[$presented] = false
		presentedScreen[$presenting] = false
		dismissedScreen[$presenting] = false

		dismissedScreen.emit('left')

		window.touchable = true

		done()

	} catch (e) {
		console.error(e)
	}
}

/**
 * @function presentScreenAfter
 * @since 0.1.0
 * @hidden
 */
export function presentScreenAfter(screen: Screen, target: Screen, segue: Segue, options: ScreenPresentOptions): Promise<void> {

	if (screen.presentee &&
		screen.presentee.dismissing) {

		return new Promise(success => {

			const present = () => {
				screen.present(target, segue, options).then(success)
			}

			if (screen.presentee) {
				screen.presentee.once('left', present)
				return
			}

			present()
		})
	}

	throw new Error(`Screen error: This screen is already presenting another screen.`)
}

/**
 * @function promptScreenAfter
 * @since 0.1.0
 * @hidden
 */
export function promptScreenAfter(screen: Screen, target: Screen, segue: Segue, options: ScreenPresentOptions): Promise<any> {

	if (screen.presentee &&
		screen.presentee.dismissing) {

		return new Promise(success => {

			const prompt = () => {
				screen.prompt(target, segue, options).then(success)
			}

			if (screen.presentee) {
				screen.presentee.once('left', prompt)
				return
			}

			prompt()
		})
	}

	throw new Error(`Screen error: This screen is already presenting another screen.`)
}

/**
 * @function getDismissTarget
 * @since 0.1.0
 * @hidden
 */
export function getDismissTarget(screen: Screen): Screen {
	return screen.presentee ? getDismissTarget(screen.presentee) : screen
}

/**
 * @method emitBeforePresent
 * @since 0.1.0
 * @hidden
 */
export async function emitBeforePresent(screen: Screen, segue: Segue) {
	screen.emit<ScreenBeforePresentEvent>('beforepresent', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitPresent
 * @since 0.1.0
 * @hidden
 */
export async function emitPresent(screen: Screen, segue: Segue) {
	screen.emit<ScreenPresentEvent>('present', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitDismiss
 * @since 0.1.0
 * @hidden
 */
export async function emitDismiss(screen: Screen, segue: Segue) {
	screen.emit<ScreenBeforeDismissEvent>('dismiss', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitBeforeEnter
 * @since 0.1.0
 * @hidden
 */
export async function emitBeforeEnter(screen: Screen, segue: Segue) {
	screen.emit<ScreenBeforeEnterEvent>('beforeenter', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitEnter
 * @since 0.1.0
 * @hidden
 */
export async function emitEnter(screen: Screen, segue: Segue) {
	screen.emit<ScreenEnterEvent>('enter', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitBeforeLeave
 * @since 0.1.0
 * @hidden
 */
export async function emitBeforeLeave(screen: Screen, segue: Segue) {
	screen.emit<ScreenBeforeLeaveEvent>('beforeleave', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitLeave
 * @since 0.1.0
 * @hidden
 */
export async function emitLeave(screen: Screen, segue: Segue) {
	screen.emit<ScreenLeaveEvent>('leave', { data: { segue } })
	await segue.ready()
}

/**
 * @method emitBeforeLeaveChain
 * @since 0.1.0
 * @hidden
 */
export function emitBeforeLeaveChain(tail: Screen, head: Screen, segue: Segue) {

	emitBeforeLeave(tail, segue)

	if (tail == head) {
		return
	}

	let presenter = tail.presenter
	if (presenter) {
		emitBeforeLeaveChain(presenter, head, segue)
	}
}

/**
 * @method emitLeaveChain
 * @since 0.1.0
 * @hidden
 */
export function emitLeaveChain(tail: Screen, head: Screen, segue: Segue) {

	emitLeave(tail, segue)

	if (tail == head) {
		return
	}

	let presenter = tail.presenter
	if (presenter) {
		emitLeaveChain(presenter, head, segue)
	}
}

/**
 * @method emitDismissChain
 * @since 0.1.0
 * @hidden
 */
export function emitDismissChain(tail: Screen, head: Screen, segue: Segue) {

	emitDismiss(tail, segue)

	if (tail == head) {
		return
	}

	let presenter = tail.presenter
	if (presenter) {
		emitDismissChain(presenter, head, segue)
	}
}

/**
 * @method disposeChain
 * @since 0.1.0
 * @hidden
 */
export function disposeChain(tail: Screen, head: Screen, destroy: boolean) {

	tail.dispose(destroy)

	if (tail == head) {
		return
	}

	let presenter = tail.presenter
	if (presenter) {
		disposeChain(presenter, head, destroy)
	}
}
