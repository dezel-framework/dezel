import { $frame } from '../symbol/Screen'
import { $presented } from '../symbol/Screen'
import { $presenter } from '../symbol/Screen'
import { $presenting } from '../symbol/Screen'
import { $screens } from '../symbol/ScreenSet'
import { $screen } from '../symbol/Segue'
import { emitBeforeEnter } from './Screen'
import { emitBeforeLeave } from './Screen'
import { emitBeforePresent } from './Screen'
import { emitEnter } from './Screen'
import { emitLeave } from './Screen'
import { emitPresent } from './Screen'
import { getSegue } from './Screen'
import { Screen } from '../Screen'
import { ScreenSet } from '../ScreenSet'
import { Segue } from '../Segue'

/**
 * @method getSelectedScreen
 * @since 0.1.0
 * @hidden
 */
export function getSelectedScreen(screenSet: ScreenSet, index: number) {

	let screen = screenSet[$screens][index]
	if (screen == null) {
		screen = screenSet[$screens][index] = createScreen(screenSet, index)
	}

	return screen
}

/**
 * @method getSelectedSegue
 * @since 0.1.0
 * @hidden
 */
export function getSelectedSegue(screenSet: ScreenSet, using: Segue | string) {

	let segue = getSegue(screenSet, using)
	if (segue == null) {
		throw new Error(`Screen error: This screen does not have a segue.`)
	}

	segue[$screen] = screenSet
	segue.configure()

	return segue
}

/**
 * @method createScreen
 * @since 0.1.0
 * @hidden
 */
export function createScreen(screen: ScreenSet, index: number) {

	let constructor = screen.screens[index]
	if (constructor == null) {
		throw new Error(`ScreenSet error: Index out of bounds`)
	}

	return new constructor()
}

/**
 * @method selectScreenAsync
 * @since 0.1.0
 * @hidden
 */
export function selectScreenAsync(screen: ScreenSet, present: Screen, dismiss: Screen, segue: Segue): Promise<void> {
	return new Promise(success => {
		requestAnimationFrame(() => selectScreen(screen, present, dismiss, segue, success))
	})
}

/**
 * @method selectScreen
 * @since 0.1.0
 * @hidden
 */
export async function selectScreen(screen: ScreenSet, present: Screen, dismiss: Screen, segue: Segue, done: () => void) {

	try {

		let window = screen.window!

		window.touchable = false

		let presenterScreen = screen
		let presentedScreen = present
		let dismissedScreen = dismiss

		presentedScreen[$presenter] = presenterScreen

		if (presentedScreen.parent == null) {
			presenterScreen.append(presentedScreen[$frame])
		}

		presentedScreen.visible = true
		presentedScreen.resolve()

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