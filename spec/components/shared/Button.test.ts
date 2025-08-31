import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Button from '../../../src/components/shared/Button.vue'

describe('Given a Button component', () => {
  describe('When rendered with default props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Button, {
        slots: {
          default: 'Click me',
        },
      })
    })

    it('Then it should display the slot content', () => {
      expect(wrapper.text()).toBe('Click me')
    })

    it('Then it should render as a button element', () => {
      expect(wrapper.element.tagName).toBe('BUTTON')
    })

    it('Then it should apply success mode classes by default', () => {
      expect(wrapper.classes()).toContain('bg-green-600')
    })

    it('Then it should apply hover classes for success mode', () => {
      expect(wrapper.classes()).toContain('hover:bg-green-700')
    })

    it('Then it should apply white text color', () => {
      expect(wrapper.classes()).toContain('text-white')
    })

    it('Then it should apply base padding classes', () => {
      expect(wrapper.classes()).toContain('px-4')
    })

    it('Then it should apply vertical padding classes', () => {
      expect(wrapper.classes()).toContain('py-2')
    })

    it('Then it should apply rounded corners', () => {
      expect(wrapper.classes()).toContain('rounded-md')
    })

    it('Then it should apply font weight', () => {
      expect(wrapper.classes()).toContain('font-medium')
    })

    it('Then it should apply transition animations', () => {
      expect(wrapper.classes()).toContain('transition-all')
    })

    it('Then it should apply transition duration', () => {
      expect(wrapper.classes()).toContain('duration-200')
    })
  })

  describe('When rendered with danger mode', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Button, {
        props: {
          mode: 'danger',
        },
      })
    })

    it('Then it should apply danger background color', () => {
      expect(wrapper.classes()).toContain('bg-red-500')
    })

    it('Then it should apply danger hover color', () => {
      expect(wrapper.classes()).toContain('hover:bg-red-600')
    })

    it('Then it should apply white text color', () => {
      expect(wrapper.classes()).toContain('text-white')
    })
  })

  describe('When rendered with warning mode', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Button, {
        props: {
          mode: 'warning',
        },
      })
    })

    it('Then it should apply warning background color', () => {
      expect(wrapper.classes()).toContain('bg-yellow-500')
    })

    it('Then it should apply warning hover color', () => {
      expect(wrapper.classes()).toContain('hover:bg-yellow-600')
    })

    it('Then it should apply white text color', () => {
      expect(wrapper.classes()).toContain('text-white')
    })
  })

  describe('When rendered with success mode explicitly', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Button, {
        props: {
          mode: 'success',
        },
      })
    })

    it('Then it should apply success background color', () => {
      expect(wrapper.classes()).toContain('bg-green-600')
    })
  })

  describe('When rendered with disabled prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Button, {
        props: {
          disabled: true,
        },
      })
    })

    it('Then it should apply disabled opacity class', () => {
      expect(wrapper.classes()).toContain('disabled:opacity-50')
    })

    it('Then it should apply disabled cursor class', () => {
      expect(wrapper.classes()).toContain('disabled:cursor-not-allowed')
    })

    it('Then it should have disabled attribute', () => {
      expect(wrapper.attributes('disabled')).toBeDefined()
    })
  })

  describe('When rendered with custom slot content', () => {
    let wrapper: VueWrapper
    const slotContent = '<span>Custom Content</span>'

    beforeEach(() => {
      wrapper = mount(Button, {
        slots: {
          default: slotContent,
        },
      })
    })

    it('Then it should render the custom content', () => {
      expect(wrapper.html()).toContain(slotContent)
    })
  })

  describe('When clicked', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(Button)
      await wrapper.trigger('click')
    })

    it('Then it should emit a click event', () => {
      expect(wrapper.emitted()).toHaveProperty('click')
    })

    it('Then it should emit click event exactly once', () => {
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('Then it should pass event object to emit', () => {
      const clickEvents = wrapper.emitted('click')
      expect(clickEvents![0][0]).toBeInstanceOf(Event)
    })
  })

  describe('When clicked while disabled', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      wrapper = mount(Button, {
        props: {
          disabled: true,
        },
      })
      await wrapper.trigger('click')
    })

    it('Then it should not emit click event', () => {
      expect(wrapper.emitted()).not.toHaveProperty('click')
    })
  })
})
