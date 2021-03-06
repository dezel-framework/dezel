import { Frame } from 'screen/Frame'
import { Screen } from 'screen/Screen'
import { Window } from 'view/Window'

/**
 * @method getScreenModalEnclosure
 * @since 0.1.0
 * @hidden
 */
export function getCurrentScreen(window: Window) {

	let index = window.children.length

	while (index--) {

		let view = window.children[index]
		if (view instanceof Frame) {
			return view.children[0] as Screen
		}

	}

	throw new Error(`Window error: Window does not have a screen.`)
}