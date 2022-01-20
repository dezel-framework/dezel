/**
 * @function get
 * @since 0.1.0
 * @hidden
 */
export function get(object: any, key: string) {
	return object[key]
}

/**
 * @function set
 * @since 0.1.0
 * @hidden
 */
export function set(object: any, key: string, val: any) {
	return object[key] = val
}