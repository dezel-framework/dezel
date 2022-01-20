import { $content } from 'component/symbol/Component'
import { $rendering } from 'component/symbol/Component'
import { $damaged } from 'component/symbol/Component'
import { $invalid } from 'component/symbol/Component'
import { $node } from 'type/Descriptor'
import { $children } from 'view/symbol/View'
import { $defaults } from 'view/symbol/View'
import { canAssign } from 'component/private/Component'
import { setSlot } from 'component/private/Component'
import { apply } from 'component/rendering/patch'
import { append } from 'util/array'
import { get } from 'util/object'
import { set } from 'util/object'
import { setRoot } from 'view/private/View'
import { updateChild } from 'view/private/View'
import { Body } from 'component/Body'
import { Component } from 'component/Component'
import { Descriptor } from 'type/Descriptor'
import { Slot } from 'view/Slot'
import { View } from 'view/View'
import { Window } from 'view/Window'

/**
 * @type Node
 * @since 0.1.0
 * @hidden
 */
export type Node = View

/**
 * @var scheduled
 * @since 0.1.0
 * @hidden
 */
let scheduled = false

/**
 * @var processed
 * @since 0.1.0
 * @hidden
 */
let processed: Array<Component> = []

/**
 * @function scheduleRender
 * @since 0.1.0
 * @hidden
 */
export function scheduleRender(component: Component) {

	let node = component.parent

	while (node) {

		/*
		 * Marks the parent components as damaged. This will make it faster in
		 * the future to only target branches that needs to be re-rendered
		 * instead of processin the whole tree.
		 */

		if (node instanceof Component) {

			if (node[$damaged] == false) {
				node[$damaged] = true
			} else {

				/*
				 * The node is already marked as damaged so we don't need to
				 * walk through the hierarchy since they will be marked as
				 * damanged already.
				 */

				break
			}

		}

		node = node.parent
	}

	component[$invalid] = true

	if (scheduled == false) {
		scheduled = true
		requestAnimationFrame(renderRoot)
	}
}

/**
 * @function renderRoot
 * @since 0.1.0
 * @hidden
 */
export function renderRoot() {

	let window = Window.main
	if (window == null) {
		return
	}

	renderTree(window, child => {
		renderComponent(child)
	})

	scheduled = false
}

/**
 * @function renderTree
 * @since 0.1.0
 * @hidden
 */
export function renderTree(root: View, callback: (child: Component) => void) {

	let queue = [root]

	while (queue.length) {

		let node = queue.shift()

		for (let child of node![$children]) {

			if (child instanceof Component) {

				if (child[$invalid]) {
					child[$invalid] = false
					callback(child)
				}

				/*
				 * We can discard branches of the tree that are not damaged
				 * since they don't contain any components that requires
				 * rendering.
				 */

				if (child[$damaged] == false) {
					continue
				}
			}

			queue.push(child)
		}
	}
}

/**
 * @function renderComponent
 * @since 0.1.0
 * @hidden
 */
export function renderComponent(component: Component) {

	enterComponent(component)

	let descriptor = component.render()

	if (component[$content]) {

		patchComponent(
			component,
			descriptor
		)

	} else if (descriptor) {

		buildComponent(
			component,
			descriptor
		)
	}

	component.emit('render')

	leaveComponent(component)
}

/**
 * @function renderComponentIfNeeded
 * @since 0.1.0
 * @hidden
 */
export function renderComponentIfNeeded(component: Component) {
	if (component[$invalid]) {
		component[$invalid] = false
		renderComponent(component)
	}
}

/**
 * @function buildComponent
 * @since 0.1.0
 * @hidden
 */
export function buildComponent(component: Component, descriptor: Descriptor) {

	let body = createBody(descriptor)

	body.attach(component)

	for (let describer of descriptor.children) {
		body.append(renderNode(
			component,
			describer
		))
	}

	component[$content] = descriptor
}

/**
 * @function patchComponent
 * @since 0.1.0
 * @hidden
 */
export function patchComponent(component: Component, descriptor: Descriptor | null) {

	apply(
		component,
		component[$content],
		descriptor
	)

	component[$content] = descriptor
}

/**
 * @function enterComponent
 * @since 0.1.0
 * @hidden
 */
export function enterComponent(component: Component) {
	processed.push(component)
	component[$rendering] = true
}

/**
 * @function leaveComponent
 * @since 0.1.0
 * @hidden
 */
export function leaveComponent(component: Component) {

	let last = processed.pop()
	if (last == component) {
		last[$rendering] = false
		return
	}

	throw new Error('Unexpected error')
}

/**
 * @function renderNode
 * @since 0.1.0
 * @hidden
 */
export function renderNode(component: Component, descriptor: Descriptor) {

	let node = createNode(descriptor)

	assignRoot(node)

	if (node instanceof Slot) {

		canAssign(component, node)

		let name = node.name
		let main = node.main

		if (main) setSlot(component, node)
		if (name) setSlot(component, node, name)
	}

	for (let describer of descriptor.children) {

		appendNode(node, renderNode(
			component,
			describer
		))

	}

	return node
}

/**
 * @function assignRoot
 * @since 0.1.0
 * @hidden
 */
export function assignRoot(node: Node) {
	setRoot(node, processed[processed.length - 1])
}

/**
 * @function appendNode
 * @since 0.1.0
 * @hidden
 */
export function appendNode(root: Node, node: Node) {
	// TODO: VirtualComponent
	root.append(node)
}

/**
 * @function insertNode
 * @since 0.1.0
 * @hidden
 */
export function insertNode(root: Node, node: Node, index: number) {
	// TODO: VirtualComponent
	root.insert(node, index)
}

/**
 * @function updateNode
 * @since 0.1.0
 * @hidden
 */
export function updateNode(root: Node, node: Node, index: number) {
	// TODO: VirtualComponent
	updateChild(root, node, index)
}

/**
 * @function removeNode
 * @since 0.1.0
 * @hidden
 */
export function removeNode(root: Node, node: Node) {
	// TODO: VirtualComponent
	root.remove(node)
}

/**
 * @function locateNode
 * @since 0.1.0
 * @hidden
 */
export function locateNode(root: Node, node: Node) {
	return root.children.indexOf(node)
}

/**
 * @function insertNodeBefore
 * @since 1.0.0
 * @hidden
 */
export function insertNodeBefore(root: Node, node: Node, target: Node) {
	insertNode(
		root,
		node,
		root.children.indexOf(target)
	)
}

/**
 * @function insertNodeAfter
 * @since 1.0.0
 * @hidden
 */
export function insertNodeAfter(root: Node, node: any, target: Node) {
	insertNode(
		root,
		node,
		root.children.indexOf(target) + 1
	)
}

/**
 * @function moveNodeBefore
 * @since 1.0.0
 * @hidden
 */
export function moveNodeBefore(root: Node, node: Node, target: Node) {
	updateNode(
		root,
		node,
		root.children.indexOf(target)
	)
}

/**
 * @function moveNodeAfter
 * @since 1.0.0
 * @hidden
 */
export function moveNodeAfter(root: Node, node: Node, target: Node) {
	updateNode(
		root,
		node,
		root.children.indexOf(target) + 1
	)
}

/**
 * @function attachNodeEvent
 * @since 0.1.0
 * @hidden
 */
export function attachNodeEvent(node: Node, type: string, callback: any) {
	node.on(type, callback)
}

/**
 * @function detachNodeEvent
 * @since 0.1.0
 * @hidden
 */
export function detachNodeEvent(node: Node, type: string, callback: any) {
	node.off(type, callback)
}

/**
 * @function createNode
 * @since 0.1.0
 * @hidden
 */
export function createNode(descriptor: Descriptor): Node {

	let node = createWith(descriptor)

	if (node instanceof View) {
		return node
	}

	throw new Error(`Component Error: Element must be of type View or Slot.`)
}

/**
 * @function createBody
 * @since 0.1.0
 * @hidden
 */
export function createBody(descriptor: Descriptor): Body {

	let node = createWith(descriptor)

	if (node instanceof Body) {
		return node
	}

	throw new Error(`Component Error: Root element must be of type Body.`)
}

/**
 * @function createWith
 * @since 0.1.0
 * @hidden
 */
export function createWith(descriptor: Descriptor) {

	let {
		type,
		attributes
	} = descriptor

	let node = new type()

	setNodeAttributes(node, attributes)

	if (node instanceof Component) {
		renderComponentIfNeeded(node)
	}

	descriptor[$node] = node

	return node
}

/**
 * @function setNodeAttributes
 * @since 0.1.0
 * @hidden
 */
export function setNodeAttributes(node: Node, attributes: any) {

	let style = attributes.style as string
	let state = attributes.state as string

	if (node instanceof View) {
		if (style || node.styles.list.length > 0) setViewStyles(node, style.split(' '))
		if (state || node.states.list.length > 0) setViewStates(node, state.split(' '))
	}

	delete attributes.style
	delete attributes.state

	for (let attribute in attributes) {
		setNodeAttribute(
			node,
			attribute,
			attributes[attribute]
		)
	}
}

/**
 * @function setNodeAttribute
 * @since 0.1.0
 * @hidden
 */
export function setNodeAttribute(node: Node, name: string, value: any) {

	let type = getEvent(name, value)
	if (type) {

		if (value) {
			node.on(type, value)
		}

		return
	}

	if (node[$defaults][name] === undefined) {
		node[$defaults][name] = get(node, name)
	}

	set(node, name, value)
}

/**
 * @function setViewStyles
 * @since 0.1.0
 * @hidden
 */
export function setViewStyles(view: View, styles: Array<string>) {

	let {
		append,
		remove
	} = diffViewStyles(view, styles)

	for (let style of append) view.styles.append(style)
	for (let style of remove) view.styles.remove(style)
}

/**
 * @function setViewStates
 * @since 0.1.0
 * @hidden
 */
export function setViewStates(view: View, states: Array<string>) {

	let {
		append,
		remove
	} = diffViewStates(view, states)

	for (let state of append) view.states.append(state)
	for (let state of remove) view.states.remove(state)
}

/**
 * @function diffViewStyles
 * @since 0.1.0
 * @hidden
 */
export function diffViewStyles(view: View, styles: Array<string>) {

	/*
	 * For now we simply remove the existing styles and
	 * insert the new one since the order is important. In the
	 * future this will be optimized.
	 */

	let remain: Array<string> = view.styles.list.slice(0)
	let insert: Array<string> = []

	for (let style of styles) if (style) {
		append(insert, style)
	}

	return {
		append: insert,
		remove: remain
	}
}

/**
 * @function diffViewStates
 * @since 0.1.0
 * @hidden
 */
export function diffViewStates(view: View, states: Array<string>) {

	/*
	 * For now we simply remove the existing states and
	 * insert the new one since the order is important. In the
	 * future this will be optimized.
	 */

	let remain: Array<string> = view.states.list.slice(0)
	let insert: Array<string> = []

	for (let state of states) if (state) {
		append(insert, state)
	}

	return {
		append: insert,
		remove: remain
	}
}

/**
 * @function getEvent
 * @since 0.1.0
 * @hidden
 */
export function getEvent(name: string, value: any) {

	let type = typeof value

	let event = (
		name[0] == 'o' &&
		name[1] == 'n' &&
		(value == null || type == 'function')
	)

	if (event) {
		return name.substring(2)
	}

	return null
}
