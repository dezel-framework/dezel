/**
 * @function locate
 * @since 0.1.0
 * @hidden
 */
export function locate(array: any, value: any) {

	let index = array.indexOf(value)
	if (index == -1) {
		return null
	}

	return index
}

/**
 * @function append
 * @since 0.1.0
 * @hidden
 */
export function append(array: any, value: any) {

	let index = array.indexOf(value)
	if (index > -1) {
		return
	}

	array.push(value)
}

/**
 * @function insert
 * @since 0.1.0
 * @hidden
 */
export function insert(array: any, value: any, at: number) {

	let index = array.indexOf(value)
	if (index > -1) {
		return
	}

	array.splice(at, 0, value)
}

/**
 * @function remove
 * @since 0.1.0
 * @hidden
 */
export function remove(array: any, value: any) {

	let index = array.indexOf(value)
	if (index == -1) {
		return
	}

	array.splice(index, 1)
}

/**
 * @function toggle
 * @since 0.1.0
 * @hidden
 */
export function toggle(array: any, value: any) {

	let index = array.indexOf(value)
	if (index == -1) {
		append(array, value)
	} else {
		remove(array, value)
	}

}