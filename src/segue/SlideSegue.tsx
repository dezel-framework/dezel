import { bound } from 'decorator/bound'
import { Event } from 'event/Event'
import { PanGestureDetector } from 'gesture/PanGestureDetector'
import { Screen } from 'screen/Screen'
import { Segue } from 'segue/Segue'
import { SegueRegistry } from 'segue/Segue'

/**
 * @class SlideSegue
 * @super Segue
 * @since 0.1.0
 */
export class SlideSegue extends Segue {

	//--------------------------------------------------------------------------
	// Properties
	//--------------------------------------------------------------------------

	/**
	 * Whether the screen is dismissable with a gesture.
	 * @property dismissWithGesture
	 * @since 0.1.0
	 */
	public dismissWithGesture: boolean

	//--------------------------------------------------------------------------
	// Methods
	//--------------------------------------------------------------------------

	/**
	 * @inherited
	 * @constructor
	 * @since 0.1.0
	 */
	constructor(options: SlideSegueOptions = {}) {

		super()

		let opts = {
			...OPTIONS,
			...options
		}

		this.dismissWithGesture = opts.dismissWithGesture

		this.gesture = new PanGestureDetector((gesture: PanGestureDetector) => {

			let leave = this.screen
			let enter = this.screen.presenter

			if (enter == null) {
				return
			}

			this.updateDismissGesture()

			let progress = this.getProgress()

			enter.opacity = this.getLeaveScreenOpacity(progress)
			enter.translationX = this.getLeaveScreenTranslation(progress)
			leave.translationX = this.getEnterScreenTranslation(progress)
		})

		this.gesture.capture = true
		this.gesture.enabled = opts.dismissWithGesture
		this.gesture.on('beforedetect', this.onBeforeDetectGesture)
		this.gesture.on('detect', this.onDetectGesture)
		this.gesture.on('cancel', this.onCancelGesture)
		this.gesture.on('finish', this.onFinishGesture)
	}

	/**
	 * @inherited
	 * @method configure
	 * @since 0.1.0
	 */
	public configure() {
		this.screen.gestures.append(this.gesture)
	}

	/**
	 * @inherited
	 * @method dispose
	 * @since 0.1.0
	 */
	public dispose() {
		this.screen.gestures.remove(this.gesture)
	}

	/**
	 * @inherited
	 * @method onBeforePresent
	 * @since 0.1.0
	 */
	public onBeforePresent(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = '100%'
		}

		if (leave) {
			leave.translationX = '0%'
			leave.opacity = 1
		}
	}

	/**
	 * @inherited
	 * @method onPresent
	 * @since 0.1.0
	 */
	public onPresent(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = '0%'
		}

		if (leave) {
			leave.translationX = '-25%'
			leave.opacity = 0.5
		}
	}

	/**
	 * @inherited
	 * @method onBeforeDismiss
	 * @since 0.1.0
	 */
	public onBeforeDismiss(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = '-25%'
			enter.opacity = 0.5
		}

		if (leave) {
			leave.translationX = '0%'
		}
	}

	/**
	 * @inherited
	 * @method onDismiss
	 * @since 0.1.0
	 */
	public onDismiss(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = '0%'
			enter.opacity = 1
		}

		if (leave) {
			leave.translationX = '100%'
		}
	}

	/**
	 * @inherited
	 * @method onAfterPresent
	 * @since 0.1.0
	 */
	public onAfterPresent(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = 0
		}

		if (leave) {
			leave.translationX = 0
			leave.opacity = 1
		}
	}

	/**
	 * @inherited
	 * @method onAfterDismiss
	 * @since 0.1.0
	 */
	public onAfterDismiss(enter?: Screen, leave?: Screen) {

		if (enter) {
			enter.translationX = 0
		}

		if (leave) {
			leave.translationX = 0
		}
	}

	//--------------------------------------------------------------------------
	// Private API
	//--------------------------------------------------------------------------

	/**
	 * @property gesture
	 * @since 0.1.0
	 * @hidden
	 */
	private gesture: PanGestureDetector

	/**
	 * @method getProgress
	 * @since 0.1.0
	 * @hidden
	 */
	private getProgress() {
		return this.gesture.translationX / (this.screen.measuredWidth - this.gesture.originX - this.gesture.threshold)
	}

	/**
	 * @method getLeaveScreenOpacity
	 * @since 0.1.0
	 * @hidden
	 */
	private getLeaveScreenOpacity(progress: number) {
		return 0.5 + (0.5 * progress)
	}

	/**
	 * @method getLeaveScreenOpacity
	 * @since 0.1.0
	 * @hidden
	 */
	private getLeaveScreenTranslation(progress: number) {
		return (25 * (1 - progress) * -1) + '%'
	}

	/**
	 * @method getEnterScreenTranslation
	 * @since 0.1.0
	 * @hidden
	 */
	private getEnterScreenTranslation(progress: number) {
		return (progress * 100) + '%'
	}

	/**
	 * @method onBeforeDetectGesture
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onBeforeDetectGesture(event: Event) {

		/*
		 * Make sure the gesture goes to the right and has started
		 * 20 pixels from the left of the screen
		 */

		if (this.gesture.originX > 20 ||
			this.gesture.originX < this.gesture.x) {
			event.cancel()
		}
	}

	/**
	 * @method onDetectGesture
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onDetectGesture(event: Event) {
		this.detectDismissGesture()
	}

	/**
	 * @method onCancelGesture
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onCancelGesture(event: Event) {
		this.cancelDismmissGesture()
	}

	/**
	 * @method onFinishGesture
	 * @since 0.1.0
	 * @hidden
	 */
	@bound private onFinishGesture(event: Event) {

		let progress = this.getProgress()
		if (progress > 0.45) {
			this.finishDismissGesture()
			return
		}

		if (this.gesture.duration < 350) {
			this.finishDismissGesture()
			return
		}

		this.cancelDismmissGesture()
	}
}

/**
 * @const OPTIONS
 * @since 0.1.0
 * @hidden
 */
const OPTIONS: Required<SlideSegueOptions> = {
	dismissWithGesture: true
}

/**
 * @interface SlideSegueOptions
 * @since 0.1.0
 */
export interface SlideSegueOptions {
	dismissWithGesture?: boolean
}

SegueRegistry.set('slide', SlideSegue)