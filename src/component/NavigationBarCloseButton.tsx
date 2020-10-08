import { NavigationBarButton } from 'component/NavigationBarButton'
import './NavigationBarCloseButton.style'

/**
 * @class NavigationBarCloseButton
 * @super NavigationBarButton
 * @since 0.1.0
 */
export class NavigationBarCloseButton extends NavigationBarButton {

	/**
	 * The default slot whereh this button will be added.
	 * @property slot
	 * @since 0.1.0
	 */
	public slot: string = 'main'
}
