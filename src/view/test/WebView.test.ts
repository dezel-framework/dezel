import { native } from 'native/native'
import { Application } from 'application/Application'
import { WebView } from 'view/WebView'

describe('WebView', () => {

	let view: WebView

	beforeAll(() => {
		Application.register()
	})

	beforeEach(() => {
		view = new WebView()
	})

	it('should have a native object', () => {
		expect(native(view)).not.toBeUndefined()
	})

})