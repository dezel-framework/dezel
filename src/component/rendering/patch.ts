import { $node } from 'type/Descriptor'
import { $defaults } from 'view/symbol/View'
import { appendNode } from 'component/rendering/render'
import { attachNodeEvent } from 'component/rendering/render'
import { createNode } from 'component/rendering/render'
import { detachNodeEvent } from 'component/rendering/render'
import { getEvent } from 'component/rendering/render'
import { insertNode } from 'component/rendering/render'
import { insertNodeBefore } from 'component/rendering/render'
import { locateNode } from 'component/rendering/render'
import { moveNodeAfter } from 'component/rendering/render'
import { moveNodeBefore } from 'component/rendering/render'
import { removeNode } from 'component/rendering/render'
import { setViewStates } from 'component/rendering/render'
import { setViewStyles } from 'component/rendering/render'
import { set } from 'util/object'
import { Component } from 'component/Component'
import { Node } from 'component/rendering/render'
import { Descriptor } from 'type/Descriptor'
import { View } from 'view/View'

/**
 * @type KeyMap
 * @since 1.0.0
 * @hidden
 */
type KeyMap = { [key: string]: number };

/**
 * @function apply
 * @since 1.0.0
 * @hidden
 */
export function apply(component: Component, oldDescriptor: Descriptor | null, newDescriptor: Descriptor | null) {

	if (newDescriptor == null) {
		throw new Error('Unexpected error')
	}

	if (oldDescriptor == null) {
		throw new Error('Unexpected error')
	}

	if (equal(oldDescriptor, newDescriptor)) {
		patch(oldDescriptor, newDescriptor)
	} else {
		throw new Error('Unexpected error')
	}
}

/**
 * @function patch
 * @since 1.0.0
 * @hidden
 */
export function patch(oldDescriptor: Descriptor, newDescriptor: Descriptor) {

	// Adapted from
	// https://github.com/snabbdom/snabbdom

	let oldChildren = oldDescriptor.children
	let newChildren = newDescriptor.children

	updateAttributes(
		oldDescriptor[$node],
		oldDescriptor.attributes,
		newDescriptor.attributes,
	)

	if (oldChildren.length &&
		newChildren.length) {
		updateChildren(oldDescriptor[$node], oldChildren, newChildren)
	} else if (newChildren.length) {
		appendChildren(oldDescriptor[$node], newChildren)
	} else if (oldChildren.length) {
		removeChildren(oldDescriptor[$node], oldChildren)
	}

	newDescriptor[$node] = oldDescriptor[$node]
}

/**
 * @function updateAttributes
 * @since 1.0.0
 * @hidden
 */
export function updateAttributes(node: Node, oldAttributes: any, newAttributes: any,) {

	let remove = { ...oldAttributes }

	for (let key in newAttributes) {

		delete remove[key]

		let oldValue = oldAttributes[key]
		let newValue = newAttributes[key]

		if (oldValue === newValue) {
			continue
		}

		if (node instanceof View) {

			switch (key) {

				case 'style':
					setViewStyles(node, newValue.split(' '))
					continue

				case 'state':
					setViewStates(node, newValue.split(' '))
					continue
			}
		}

		let event = getEvent(key, newValue)
		if (event) {
			if (oldValue) detachNodeEvent(node, event, oldValue)
			if (newValue) attachNodeEvent(node, event, newValue)
			continue
		}

		set(node, key, newValue)
	}

	for (let key in remove) {
		set(node, key, node[$defaults][key])
	}
}

/**
 * @function updateChildren
 * @since 1.0.0
 * @hidden
 */
export function updateChildren(node: Node, oldChildren: Array<Descriptor>, newChildren: Array<Descriptor>) {

	// Adapted from
	// https://github.com/snabbdom/snabbdom

	let oldHeadIndex = 0
	let newHeadIndex = 0
	let oldTailIndex = oldChildren.length - 1
	let newTailIndex = newChildren.length - 1

	let oldHeadDescriptor = oldChildren[0]
	let newHeadDescriptor = newChildren[0]
	let oldTailDescriptor = oldChildren[oldTailIndex]
	let newTailDescriptor = newChildren[newTailIndex]

	let keyMap: KeyMap | null = null

	while (
		oldHeadIndex <= oldTailIndex &&
		newHeadIndex <= newTailIndex
	) {

		if (oldHeadDescriptor == null) {

			oldHeadDescriptor = oldChildren[++oldHeadIndex]

		} else if (oldTailDescriptor == null) {

			oldTailDescriptor = oldChildren[--oldTailIndex]

		} else if (newHeadDescriptor == null) {

			newHeadDescriptor = newChildren[++newHeadIndex]

		} else if (newTailDescriptor == null) {

			newTailDescriptor = newChildren[--newTailIndex]

		} else if (equal(oldHeadDescriptor, newHeadDescriptor)) {

			patch(
				oldHeadDescriptor,
				newHeadDescriptor
			)

			oldHeadDescriptor = oldChildren[++oldHeadIndex]
			newHeadDescriptor = newChildren[++newHeadIndex]

		} else if (equal(oldTailDescriptor, newTailDescriptor)) {

			patch(
				oldTailDescriptor,
				newTailDescriptor
			)

			oldTailDescriptor = oldChildren[--oldTailIndex]
			newTailDescriptor = newChildren[--newTailIndex]

		} else if (equal(oldHeadDescriptor, newTailDescriptor)) {

			patch(
				oldHeadDescriptor,
				newTailDescriptor
			)

			oldHeadDescriptor = oldChildren[++oldHeadIndex]
			newTailDescriptor = newChildren[--newTailIndex]

			moveNodeAfter(
				node,
				oldHeadDescriptor[$node],
				oldTailDescriptor[$node]
			)

		} else if (equal(oldTailDescriptor, newHeadDescriptor)) {

			patch(
				oldTailDescriptor,
				newHeadDescriptor
			)

			oldTailDescriptor = oldChildren[--oldTailIndex]
			newHeadDescriptor = newChildren[++newHeadIndex]

			moveNodeBefore(
				node,
				oldTailDescriptor[$node],
				oldHeadDescriptor[$node]
			)

		} else {

			if (keyMap == null) {
				keyMap = createKeyMap(
					oldChildren,
					oldHeadIndex,
					oldTailIndex
				)
			}

			let index = keyMap[newHeadDescriptor.key!]

			if (index == null) {

				// New element
				insertNodeBefore(
					node,
					createNode(newHeadDescriptor),
					oldHeadDescriptor[$node]
				)

			} else {

				let oldDescriptor = oldChildren[index]

				patch(
					oldDescriptor,
					newHeadDescriptor
				)

				delete oldChildren[index]

				moveNodeBefore(
					node,
					oldDescriptor[$node],
					oldHeadDescriptor[$node]
				)
			}

			newHeadDescriptor = newChildren[++newHeadIndex]
		}
	}

	if (oldHeadIndex <= oldTailIndex ||
		newHeadIndex <= newTailIndex) {

		if (oldHeadIndex > oldTailIndex) {

			let before = (
				newChildren[newTailIndex + 1] &&
				newChildren[newTailIndex + 1][$node] ||
				null
			)

			appendChildrenIn(
				node,
				newChildren,
				newHeadIndex,
				newTailIndex,
				before
			)

		} else {

			removeChildrenIn(
				node,
				oldChildren,
				oldHeadIndex,
				oldTailIndex
			)

		}
	}
}

/**
 * @function appendChildren
 * @since 1.0.0
 * @hidden
 */
export function appendChildren(node: Node, children: Array<Descriptor>) {
	for (let child of children) {
		appendNode(node, createNode(child))
	}
}

/**
 * @function removeChildren
 * @since 1.0.0
 * @hidden
 */
export function removeChildren(node: Node, children: Array<Descriptor>) {
	for (let child of children) {
		removeNode(node, child[$node])
	}
}

/**
 * @function appendChildrenIn
 * @since 1.0.0
 * @hidden
 */
export function appendChildrenIn(node: Node, children: Array<Descriptor>, s: number, e: number, before: Node) {

	let index = 0
	if (before) {
		index = locateNode(node, before)
	}

	for (let i = s; i <= e; i++) {

		let child = children[i];
		if (child == null) {
			continue
		}

		if (before) {
			insertNode(node, createNode(child), index)
		} else {
			appendNode(node, createNode(child))
		}
	}
}

/**
 * @function removeChildrenIn
 * @since 1.0.0
 * @hidden
 */
export function removeChildrenIn(node: Node, children: Array<Descriptor>, s: number, e: number) {

	for (let i = s; i <= e; i++) {

		let child = children[i];
		if (child == null) {
			continue
		}

		removeNode(node, child[$node])
	}
}

/**
 * @function equal
 * @since 1.0.0
 * @hidden
 */
export function equal(old: Descriptor, now: Descriptor) {
	return old.type == now.type && old.key === now.key
}




function createKeyMap(children: Array<Descriptor>, s: number, e: number): KeyMap {

	let map: KeyMap = {}

	for (let i = s; i <= e; ++i) {
		let key = children[i]?.key
		if (key) {
			map[key] = i
		}
	}

	return map;
}