import { $parent } from 'view/symbol/Slot'
import { Application } from 'application/Application'
import { Event } from 'event/Event'
import { Slot } from 'view/Slot'
import { View } from 'view/View'

describe('Slot', () => {

	let slot: Slot

	beforeAll(() => {
		Application.register()
	})

	beforeEach(() => {
		slot = new Slot()
	})

	it('should insert the slot at the beginning of the view', () => {

		let view = new View()

		slot.attach(view, view.children.length)

		expect(slot[$parent]).toBe(view)
	})

	it('should insert the slot view in the containing view', () => {

		let view = new View()
		let child1 = new View()
		let child2 = new View()

		slot.attach(view, view.children.length)

		slot.append(child1)
		slot.append(child2)

		expect(slot.get(0)).toBe(child1)
		expect(slot.get(1)).toBe(child2)
		expect(view.children[0]).toBe(child1)
		expect(view.children[1]).toBe(child2)
	})

	it('should insert the initial slot views in the containing view', () => {

		let view = new View()
		let child1 = new View()
		let child2 = new View()

		slot.append(child1)
		slot.append(child2)

		slot.attach(view, view.children.length)

		expect(slot.children.length).toBe(2)
		expect(slot.get(0)).toBe(child1)
		expect(slot.get(1)).toBe(child2)

		expect(view.children.length).toBe(2)
		expect(view.children[0]).toBe(child1)
		expect(view.children[1]).toBe(child2)
	})

	it('should insert the slot view correctly', () => {

		let view = new View()
		let child1 = new View()
		let child2 = new View()
		let child3 = new View()
		let child4 = new View()

		slot.attach(view, view.children.length)

		view.append(child1)
		view.append(child2)

		slot.append(child3)
		slot.append(child4)

		expect(slot.get(0)).toBe(child3)
		expect(slot.get(1)).toBe(child4)

		expect(view.children[0]).toBe(child1)
		expect(view.children[1]).toBe(child2)
		expect(view.children[2]).toBe(child3)
		expect(view.children[3]).toBe(child4)

	})

	it('should remove the slot view', () => {

		let view = new View()
		let child1 = new View()
		let child2 = new View()
		let child3 = new View()
		let child4 = new View()

		slot.attach(view, view.children.length)

		view.append(child1)
		view.append(child2)

		slot.append(child3)
		slot.append(child4)

		slot.remove(child3)
		slot.remove(child4)

		expect(view.children[0]).toBe(child1)
		expect(view.children[1]).toBe(child2)
		expect(view.children[2]).toBeUndefined()
		expect(view.children[3]).toBeUndefined()

	})

	it('should emit an insert event', () => {

		let child1 = new View()
		let child2 = new View()

		let fn1 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(child1)
			expect(event.data.index).toBe(0)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(child2)
			expect(event.data.index).toBe(1)
		})

		slot.once('insert', fn1)
		slot.append(child1)
		slot.once('insert', fn2)
		slot.append(child2)

		expect(fn1).toHaveBeenCalled()
		expect(fn2).toHaveBeenCalled()
	})

	it('should emit a remove event', () => {

		let child1 = new View()
		let child2 = new View()

		let fn1 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(child2)
			expect(event.data.index).toBe(1)
		})

		let fn2 = jasmine.createSpy().and.callFake((event: Event) => {
			expect(event.data.child).toBe(child1)
			expect(event.data.index).toBe(0)
		})

		slot.append(child1)
		slot.append(child2)

		slot.once('remove', fn1)
		slot.remove(child2)
		slot.once('remove', fn2)
		slot.remove(child1)

		expect(fn1).toHaveBeenCalled()
		expect(fn2).toHaveBeenCalled()
	})

})