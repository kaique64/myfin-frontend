import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import CardContainer from '../../../src/components/shared/card/CardContainer.vue'

type CardContainerWrapper = VueWrapper<ComponentPublicInstance & InstanceType<typeof CardContainer>>

const factory = (slots: Record<string, string> = {}) => {
  return mount(CardContainer, {
    slots,
  }) as CardContainerWrapper
}

describe('Given a CardContainer component', () => {
  describe('When rendered with default state', () => {
    let wrapper: CardContainerWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render a div element', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('Then it should apply mx-auto class', () => {
      expect(wrapper.classes()).toContain('mx-auto')
    })

    it('Then it should apply p-6 class', () => {
      expect(wrapper.classes()).toContain('p-6')
    })

    it('Then it should apply bg-white class', () => {
      expect(wrapper.classes()).toContain('bg-white')
    })

    it('Then it should apply rounded-lg class', () => {
      expect(wrapper.classes()).toContain('rounded-lg')
    })
  })

  describe('When rendered with slot content', () => {
    let wrapper: CardContainerWrapper

    beforeEach(() => {
      wrapper = factory({
        default: '<p>Test content</p>',
      })
    })

    it('Then it should render the slot content', () => {
      expect(wrapper.html()).toContain('<p>Test content</p>')
    })

    it('Then it should display the slot text content', () => {
      expect(wrapper.text()).toContain('Test content')
    })
  })

  describe('When rendered with multiple slot elements', () => {
    let wrapper: CardContainerWrapper

    beforeEach(() => {
      wrapper = factory({
        default: '<h1>Title</h1><p>Description</p><button>Action</button>',
      })
    })

    it('Then it should render all slot elements', () => {
      expect(wrapper.find('h1').exists()).toBe(true)
    })

    it('Then it should render paragraph element', () => {
      expect(wrapper.find('p').exists()).toBe(true)
    })

    it('Then it should render button element', () => {
      expect(wrapper.find('button').exists()).toBe(true)
    })

    it('Then it should display all text content', () => {
      expect(wrapper.text()).toContain('Title')
    })

    it('Then it should display description text', () => {
      expect(wrapper.text()).toContain('Description')
    })

    it('Then it should display action text', () => {
      expect(wrapper.text()).toContain('Action')
    })
  })

  describe('When rendered with empty slot', () => {
    let wrapper: CardContainerWrapper

    beforeEach(() => {
      wrapper = factory({
        default: '',
      })
    })

    it('Then it should still render the container', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('Then it should have empty text content', () => {
      expect(wrapper.text().trim()).toBe('')
    })
  })

  describe('When checking component structure', () => {
    let wrapper: CardContainerWrapper

    beforeEach(() => {
      wrapper = factory({
        default: '<span>Child content</span>',
      })
    })

    it('Then it should have only one root element', () => {
      expect(wrapper.element.children.length).toBe(1)
    })

    it('Then it should contain the slot content as direct child', () => {
      const span = wrapper.find('span')
      expect(span.exists()).toBe(true)
    })

    it('Then it should maintain the correct CSS class combination', () => {
      const expectedClasses = ['mx-auto', 'p-6', 'bg-white', 'rounded-lg']
      const actualClasses = wrapper.classes()

      expect(expectedClasses.every((cls) => actualClasses.includes(cls))).toBe(true)
    })
  })
})
