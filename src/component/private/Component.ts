import { $main } from 'component/symbol/Component'
import { $slots } from 'component/symbol/Component'
import { $slot } from 'view/symbol/View'
import { isBoolDescriptor } from 'type/Descriptor'
import { isNullDescriptor } from 'type/Descriptor'
import { isTextDescriptor } from 'type/Descriptor'
import { setNodeData as setNodeData } from 'view/private/View'
import { setNodeType as setNodeType } from 'view/private/View'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Descriptor } from 'type/Descriptor'
import { NodeDescriptor } from 'type/Descriptor'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

/**
 * @function canInsert
 * @since 0.1.0
 * @hidden
 */
export function canInsert(component: Component, child: View, slot: string | null = null) {

}

/**
 * @function canRemove
 * @since 0.1.0
 * @hidden
 */
export function canRemove(component: Component, child: View, slot: string | null = null) {
	// make sure the $host match
}

/**
 * @function renderBody
 * @since 0.1.0
 * @hidden
 */
export function canAssignSlot(component: Component, slot: Slot) {

	let main = slot.main
	let name = slot.name

	if (main && component[$slots][$main]) {
		throw new Error(
			`Component error: Component ${component.constructor.name} already have a main slot.`
		)
	}

	if (name && component[$slots][name] == null) {
		throw new Error(
			`Component error: Component ${component.constructor.name} already have a slot named ${name}.`
		)
	}
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
		child.renderIfNeeded()
	}
}

/**
 * @function renderComponent
 * @since 0.1.0
 * @hidden
 */
export function renderComponent(component: Component) {

	let descriptor = component.render()

	/*
	 * Somehow if I only check for the NodeDescriptor type
	 * the type guards fails.
	 */

	if (isTextDescriptor(descriptor) ||
		isBoolDescriptor(descriptor) ||
		isNullDescriptor(descriptor)) {

		/*
		 * The render event will be invoked even though the component
		 * has nothing to render.
		 */

		component.emit('render')

		return null
	}

	let root = renderBody(descriptor)

	root.attach(component)

	for (let child of descriptor.children) {

		let node = renderComponentChild(component, child)
		if (node == null) {
			continue
		}

		root.append(node)
	}

	component.emit('render')

	return root
}

/**
 * @function renderComponentChildren
 * @since 0.1.0
 * @hidden
 */
export function renderComponentChild(component: Component, descriptor: Descriptor) {

	/*
	 * Somehow if I only check for the NodeDescriptor type
	 * the type guards fails.
	 */

	if (isTextDescriptor(descriptor) ||
		isBoolDescriptor(descriptor) ||
		isNullDescriptor(descriptor)) {
		return null
	}

	let root = renderNode(descriptor)

	if (root instanceof Slot) {

		let name = root.name
		let main = root.main

		if (name == '' &&
			main == false) {
			throw new Error(`Component error: A non-main slot must have a name.`)
		}

		canAssignSlot(component, root)

		if (main) component[$slots][$main] = root
		if (name) component[$slots][name] = root
	}

	for (let child of descriptor.children) {

		let node = renderComponentChild(component, child)
		if (node == null) {
			continue
		}

		root.append(node)
	}

	return root
}

/**
 * @function renderBody
 * @since 0.1.0
 * @hidden
 */
export function renderBody(descriptor: NodeDescriptor): Body {

	let body = renderNode(descriptor)

	if (body &&
		body instanceof Body) {
		return body
	}

	throw new Error(`Component Error: The root element of a component must be of type Body.`)
}

/**
 * @function renderNode
 * @since 0.1.0
 * @hidden
 */
export function renderNode(descriptor: NodeDescriptor): View {

	let {
		type,
		data
	} = descriptor

	let node = new type()

	setNodeType(node, type)
	setNodeData(node, data)
	setNodeAttributes(node, data)

	if (node instanceof Component) {
		node.renderIfNeeded()
	}

	return node
}

/**
 * @function setNodeAttributes
 * @since 0.1.0
 * @hidden
 */
export function setNodeAttributes(node: View, data: any) {

	let style = data.style as string
	let state = data.state as string

	if (style) setNodeStyles(node, style.split(' '))
	if (state) setNodeStates(node, state.split(' '))

	delete data.style
	delete data.state

	for (let prop in data) {
		setNodeAttribute(node, prop, data[prop])
	}
}

/**
 * @function setNodeAttribute
 * @since 0.1.0
 * @hidden
 */
export function setNodeAttribute(node: View, name: string, value: any) {

	let type = typeof value

	let event = (
		name[0] == 'o' &&
		name[1] == 'n' &&
		type == 'function'
	)

	if (event) {

		let type = name.substring(2)
		if (type) {
			node.on(type, value)
		}

		return
	}

	set(node, name, value)
}

/**
 * @function setNodeStyles
 * @since 0.1.0
 * @hidden
 */
export function setNodeStyles(node: View, styles: Array<string>) {
	for (let style of styles) if (style) node.styles.append(style)
}

/**
 * @function setNodeStates
 * @since 0.1.0
 * @hidden
 */
export function setNodeStates(node: View, states: Array<string>) {
	for (let state of states) if (state) node.states.append(state)
}

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
