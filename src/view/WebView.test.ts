import { Application } from 'application/Application'
import { Dezel } from 'core/Dezel'
import { native } from 'native/native'
import { WebView } from 'view/WebView'

describe('WebView', () => {

	let view: WebView

	beforeAll(() => {
		Dezel.registerApplication(new Application)
	})

	beforeEach(() => {
		view = new WebView()
	})

	it('should have a native object', () => {
		expect(native(view)).not.toBeUndefined()
	})

})