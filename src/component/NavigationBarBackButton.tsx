import { Dezel } from 'index'
import { NavigationBarButton } from 'component/NavigationBarButton'
import './NavigationBarBackButton.style'

/**
 * @class NavigationBarBackButton
 * @super NavigationBarButton
 * @since 0.1.0
 */
export class NavigationBarBackButton extends NavigationBarButton {

	/**
	 * The default slot whereh this button will be added.
	 * @property slot
	 * @since 0.1.0
	 */
	public slot: string = 'back'
}