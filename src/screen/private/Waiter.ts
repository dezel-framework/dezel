/**
 * @class Waiter
 * @since 0.1.0
 * @hidden
 */
export class Waiter {

	//--------------------------------------------------------------------------
	// Propertis
	//--------------------------------------------------------------------------

	/**
	 * @property promise
	 * @since 0.1.0
	 */
	public promise: Promise<any>

	/**
	 * @property done
	 * @since 0.1.0
	 */
	public done: any

	//--------------------------------------------------------------------------
	// Propertis
	//--------------------------------------------------------------------------

	/**
	 * @constructor
	 * @since 0.1.0
	 */
	public constructor() {
		this.promise = new Promise(done => {
			this.done = done
		})
	}
}