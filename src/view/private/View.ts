import { $children } from 'view/symbol/View'
import { $host } from 'view/symbol/View'
import { $root } from 'view/symbol/View'
import { native } from 'native/native'
import { View } from 'view/View'

/**
 * @const classNames
 * @since 0.1.0
 * @hidden
 */
export const classNames = new Map<any, any>()

/**
 * @function canInsert
 * @since 0.1.0
 * @hidden
 */
export function canInsert(view: View, child: View, index: number) {
	if (view == child) throw new Error(`View Error: Attempting to add insert itseft as a child view.`)
}

/**
 * @function canRemove
 * @since 0.1.0
 * @hidden
 */
export function canRemove(view: View, child: View) {
	if (view == child) throw new Error(`View Error: Attempting to add remove itseft as a child view.`)
}

/**
 * @function insertEntry
 * @since 0.1.0
 * @hidden
 */
export function insertEntry(view: View, child: View, index: number) {
	view[$children].splice(index, 0, child)
}

/**
 * @function removeEntry
 * @since 0.1.0
 * @hidden
 */
export function removeEntry(view: View, child: View, index: number) {
	view[$children].splice(index, 1)
}

/**
 * @function insertChild
 * @since 0.1.0
 * @hidden
 */
export function insertChild(view: View, child: View, index: number) {
	native(view).insert(native(child), index)
}

/**
 * @function removeChild
 * @since 0.1.0
 * @hidden
 */
export function removeChild(view: View, child: View, index: number) {
	native(view).remove(native(child), index)
}

/**
 * @function updateChild
 * @since 0.1.0
 * @hidden
 */
export function updateChild(view: View, child: View, index: number) {
	native(view).update(native(child), index)
}

/**
 * @function insertAfter
 * @since 0.1.0
 * @hidden
 */
export function insertAfter(view: View, child: View, target: View) {

	let index = view.children.indexOf(target)
	if (index == -1) {
		return
	}

	view.insert(child, index)
}

/**
 * @function insertBefore
 * @since 0.1.0
 * @hidden
 */
export function insertBefore(view: View, child: View, target: View) {

	let index = view.children.indexOf(target)
	if (index == -1) {
		return
	}

	view.insert(child, index + 1)
}

/**
 * @function setRoot
 * @since 0.1.0
 * @hidden
 */
export function setRoot(view: View, root: View | null) {

	if (view[$root] ||
		view[$root] == root) {
		return
	}

	view[$root] = root

	native(view).root = root
}

/**
 * @function setHost
 * @since 0.1.0
 * @hidden
 */
export function setHost(view: View, host: View | null) {

	if (view[$host] ||
		view[$host] == host) {
		return
	}

	view[$host] = host

	native(view).host = host
}

/**
 * @function getClassName
 * @since 0.1.0
 * @hidden
 */
export function getClassName(view: View) {

	if (view.constructor == View) {
		return 'View'
	}

	let className = classNames.get(view.constructor)
	if (className == null) {
		classNames.set(view.constructor, className = getClassList(view))
	}

	return className
}

/**
 * @function getClassList
 * @since 0.1.0
 * @hidden
 */
export function getClassList(view: View) {

	let klass = view.constructor.name
	let proto = view.constructor.prototype

	while (proto) {

		proto = Object.getPrototypeOf(proto)

		let constructor = proto.constructor
		if (constructor == View) {
			proto = null
		}

		klass = klass + ' ' + constructor.name
	}

	return klass
}
