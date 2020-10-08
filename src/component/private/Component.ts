import { $body } from 'component/symbol/Component'
import { $rendered } from 'component/symbol/Component'
import { $slots } from 'component/symbol/Component'
import { Component } from 'component/Component'
import { Slot } from 'component/Slot'
import { $references } from 'view/symbol/Reference'
import { getRefName } from 'view/private/Reference'


/**
 * @const renderComponentStack
 * @since 0.1.0
 * @hidden
 */
const renderComponentStack: Array<Component> = []

/**
 * @function getSlot
 * @since 0.1.0
 * @hidden
 */
export function getSlot(component: Component, name: string) {
	return component[$slots][name]
}

/**
 * @function setSlot
 * @since 0.1.0
 * @hidden
 */
export function setSlot(component: Component, slot: Slot) {

	if (slot.name == '' &&
		slot.main == false) {
		throw new Error(`Component error: Component received a slot with an empty name.`)
	}

	if (slot.main) {

		if (component[$body] == null) {
			component[$body] = slot
			return
		}

		throw new Error(`Component error: Component already have a main slot.`)
	}

	if (component[$slots][slot.name] == null) {
		component[$slots][slot.name] = slot
		return
	}

	throw new Error(`Component error: Component already have a slot named ${slot.name}.`)
}

/**
 * @function renderIfNeeded
 * @since 0.1.0
 * @hidden
 */
export function renderIfNeeded(component: Component) {

	if (component[$rendered]) {
		return
	}

	component[$rendered] = true

	pushComponent(component)
	renderComponent(component)
	pullComponent(component)

	validateComponentRefs(component)

	Component.seal(component)
}

/**
 * @function renderComponent
 * @since 0.1.0
 * @hidden
 */
export function renderComponent(component: Component) {

	let view = component.render()
	if (view) {
		component.append(view)
	}

	component.onRender()
}

/**
 * @function validateComponentRefs
 * @since 0.1.0
 * @hidden
 */
export function validateComponentRefs(object: any) {

	let references = object[$references]
	if (references == null) {
		return
	}

	for (let accessor of references) {

		let reference = object[accessor]
		if (reference &&
			reference.value) {
			continue
		}

		throw new Error(`Reference ${getRefName(accessor)} on ${object.constructor.name} has not been set.`)
	}
}

/**
 * @function pushComponent
 * @since 0.1.0
 * @hidden
 */
export function pushComponent(component: Component) {

	let current = getRenderingComponent()
	if (current == component) {
		throw new Error('Unexpected error.')
	}

	renderComponentStack.push(component)
}

/**
 * @function pullComponent
 * @since 0.1.0
 * @hidden
 */
export function pullComponent(component: Component) {

	let current = getRenderingComponent()
	if (current != component) {
		throw new Error('Unexpected error.')
	}

	renderComponentStack.pop()
}

/**
 * @function getComponent
 * @since 0.1.0
 * @hidden
 */
export function getRenderingComponent() {
	return renderComponentStack[renderComponentStack.length - 1]
}
