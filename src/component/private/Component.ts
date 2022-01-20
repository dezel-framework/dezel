import { $content } from 'component/symbol/Component'
import { $main } from 'component/symbol/Component'
import { $slots } from 'component/symbol/Component'
import { $slot } from 'view/symbol/View'
import { renderComponentIfNeeded } from 'component/rendering/render'
import { Component } from 'component/Component'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

/**
 * @function canInsert
 * @since 0.1.0
 * @hidden
 */
export function canInsert(component: Component, child: View, slot: string | null = null) {
	// TODO
}

/**
 * @function canRemove
 * @since 0.1.0
 * @hidden
 */
export function canRemove(component: Component, child: View, slot: string | null = null) {
	// TODO
	// make sure the $host match
}

/**
 * @function canAssign
 * @since 0.1.0
 * @hidden
 */
export function canAssign(component: Component, slot: Slot) {
	// TODO
}

/**
 * @function appendChild
 * @since 0.1.0
 * @hidden
 */
export function appendChild(component: Component, child: View, slot: string | null = null) {

	let delegate = slot
		? component[$slots][slot]
		: component[$slots][$main]

	if (delegate) {
		delegate.append(child)
		return
	}

	component.append(child)
}

/**
 * @function insertChild
 * @since 0.1.0
 * @hidden
 */
export function insertChild(component: Component, child: View, index: number, slot: string | null = null) {

	let delegate = slot
		? component[$slots][slot]
		: component[$slots][$main]

	if (delegate) {
		delegate.insert(child, index)
		return
	}

	component.insert(child, index)
}

/**
 * @function removeChild
 * @since 0.1.0
 * @hidden
 */
export function removeChild(component: Component, child: View) {

	let delegate = child[$slot]
	if (delegate) {
		delegate.remove(child)
		return
	}

	component.remove(child)
}

/**
 * @function renderChild
 * @since 0.1.0
 * @hidden
 */
export function renderChild(component: Component, child: View) {
	if (child instanceof Component) {
		renderComponentIfNeeded(component)
	}
}

/**
 * @function getSlot
 * @since 0.1.0
 * @hidden
 */
export function getSlot(component: Component, slot: any = $main): Slot | null {
	return component[$slots][slot]
}

/**
 * @function setSlot
 * @since 0.1.0
 * @hidden
 */
export function setSlot(component: Component, slot: Slot, name: any = $main) {

	// let current = getSlot(component, name)

	// if (current &&
	// 	current.children.length) {

	// 	while (current.children.length) {
	// 		slot.append(current.children[0])
	// 	}

	// }

	component[$slots][name] = slot
}