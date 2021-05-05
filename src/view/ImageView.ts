import { bridge } from 'native/bridge'
import { native } from 'native/native'
import { View } from 'view/View'

@bridge('dezel.view.ImageView')

/**
 * @class ImageView
 * @super View
 * @since 0.1.0
 */
export class ImageView extends View {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * The image view's string.
	 * @property string
	 * @since 0.1.0
	 */
	@native public path: string | null

	/**
	 * The image view's image fit mode.
	 * @property imageFit
	 * @since 0.1.0
	 */
	@native public imageFit: 'contain' | 'cover'

	/**
	 * The image view's image position.
	 * @property imagePosition
	 * @since 0.1.0
	 */
	@native public imagePosition: 'top left' | 'top right' | 'top center' | 'left' | 'right' | 'center' | 'bottom left' | 'bottom right' | 'bottom center'

	/**
	 * The image view's tint.
	 * @property tint
	 * @since 0.1.0
	 */
	@native public tint: 'transparent' | string
}