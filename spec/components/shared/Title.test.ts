import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Title from '../../../src/components/shared/Title.vue'

describe('Given a Title component', () => {
  describe('When rendered with default props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        slots: {
          default: 'Test Title',
        },
      })
    })

    it('Then it should display the slot content', () => {
      expect(wrapper.text()).toBe('Test Title')
    })

    it('Then it should render as h1 element by default', () => {
      expect(wrapper.element.tagName).toBe('H1')
    })

    it('Then it should apply default size class (xl)', () => {
      expect(wrapper.classes()).toContain('text-xl')
    })

    it('Then it should apply default weight class (bold)', () => {
      expect(wrapper.classes()).toContain('font-bold')
    })

    it('Then it should apply default color class', () => {
      expect(wrapper.classes()).toContain('text-gray-900')
    })
  })

  describe('When rendered with custom size prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          size: '3xl',
        },
        slots: {
          default: 'Large Title',
        },
      })
    })

    it('Then it should apply the custom size class', () => {
      expect(wrapper.classes()).toContain('text-3xl')
    })

    it('Then it should not apply the default size class', () => {
      expect(wrapper.classes()).not.toContain('text-xl')
    })
  })

  describe('When rendered with custom tag prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          tag: 'h2',
        },
        slots: {
          default: 'Subtitle',
        },
      })
    })

    it('Then it should render as h2 element', () => {
      expect(wrapper.element.tagName).toBe('H2')
    })
  })

  describe('When rendered with custom weight prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          weight: 'semibold',
        },
        slots: {
          default: 'Semibold Title',
        },
      })
    })

    it('Then it should apply the custom weight class', () => {
      expect(wrapper.classes()).toContain('font-semibold')
    })

    it('Then it should not apply the default weight class', () => {
      expect(wrapper.classes()).not.toContain('font-bold')
    })
  })

  describe('When rendered with custom color prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          color: 'text-blue-600',
        },
        slots: {
          default: 'Blue Title',
        },
      })
    })

    it('Then it should apply the custom color class', () => {
      expect(wrapper.classes()).toContain('text-blue-600')
    })

    it('Then it should not apply the default color class', () => {
      expect(wrapper.classes()).not.toContain('text-gray-900')
    })
  })

  describe('When rendered with custom margin prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          margin: 'mt-8 mb-4',
        },
        slots: {
          default: 'Custom Margin Title',
        },
      })
    })

    it('Then it should apply the custom margin classes', () => {
      expect(wrapper.classes()).toContain('mt-8')
      expect(wrapper.classes()).toContain('mb-4')
    })
  })

  describe('When rendered with all size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'] as const

    sizes.forEach((size) => {
      describe(`When size is ${size}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Title, {
            props: {
              size,
            },
            slots: {
              default: `Title ${size}`,
            },
          })
        })

        it(`Then it should apply text-${size} class`, () => {
          expect(wrapper.classes()).toContain(`text-${size}`)
        })
      })
    })
  })

  describe('When rendered with all weight variants', () => {
    const weights = ['normal', 'medium', 'semibold', 'bold', 'extrabold'] as const

    weights.forEach((weight) => {
      describe(`When weight is ${weight}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Title, {
            props: {
              weight,
            },
            slots: {
              default: `Title ${weight}`,
            },
          })
        })

        it(`Then it should apply font-${weight} class`, () => {
          expect(wrapper.classes()).toContain(`font-${weight}`)
        })
      })
    })
  })

  describe('When rendered with all tag variants', () => {
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

    tags.forEach((tag) => {
      describe(`When tag is ${tag}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Title, {
            props: {
              tag,
            },
            slots: {
              default: `Title ${tag}`,
            },
          })
        })

        it(`Then it should render as ${tag.toUpperCase()} element`, () => {
          expect(wrapper.element.tagName).toBe(tag.toUpperCase())
        })
      })
    })
  })

  describe('When rendered with multiple custom props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title, {
        props: {
          size: '2xl',
          tag: 'h3',
          weight: 'medium',
          color: 'text-red-500',
          margin: 'my-4',
        },
        slots: {
          default: 'Complex Title',
        },
      })
    })

    it('Then it should apply all custom classes', () => {
      expect(wrapper.classes()).toContain('text-2xl')
      expect(wrapper.classes()).toContain('font-medium')
      expect(wrapper.classes()).toContain('text-red-500')
      expect(wrapper.classes()).toContain('my-4')
    })

    it('Then it should render with the correct tag', () => {
      expect(wrapper.element.tagName).toBe('H3')
    })

    it('Then it should display the slot content', () => {
      expect(wrapper.text()).toBe('Complex Title')
    })
  })

  describe('When rendered with empty slot', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Title)
    })

    it('Then it should render without content', () => {
      expect(wrapper.text()).toBe('')
    })

    it('Then it should still apply default classes', () => {
      expect(wrapper.classes()).toContain('text-xl')
      expect(wrapper.classes()).toContain('font-bold')
      expect(wrapper.classes()).toContain('text-gray-900')
    })
  })

  describe('When rendered with HTML content in slot', () => {
    let wrapper: VueWrapper
    const htmlContent = '<span class="highlight">Highlighted</span> Title'

    beforeEach(() => {
      wrapper = mount(Title, {
        slots: {
          default: htmlContent,
        },
      })
    })

    it('Then it should render the HTML content', () => {
      expect(wrapper.html()).toContain(htmlContent)
    })

    it('Then it should find the span element', () => {
      expect(wrapper.find('span.highlight').exists()).toBe(true)
    })

    it('Then it should contain the full text content', () => {
      expect(wrapper.text()).toBe('Highlighted Title')
    })
  })
})
