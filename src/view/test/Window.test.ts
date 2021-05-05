import { Dezel } from 'index'
import { native } from 'native/native'
import { Application } from 'application/Application'
import { Window } from 'view/Window'

describe('Window', () => {

	let window: Window

	beforeAll(() => {
		Application.register()
	})

	beforeEach(() => {
		window = new Window()
	})

	it('should have a native object', () => {
		expect(native(window)).not.toBeUndefined()
	})

})