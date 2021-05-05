import { Dezel } from 'index'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Slot } from 'view/Slot'
import './Container.style'

/**
 * @class Container
 * @super Component
 * @since 0.1.0
 */
export class Container extends Component {

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inhreited
	 * @method render
	 * @since 0.1.0
	 */
	public render() {
		return (
			<Body>
				<Slot main />
			</Body>
		)
	}
}