import { describe, it, expect, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import Divider from '../../../src/components/shared/Divider.vue'

describe('Given a Divider component', () => {
  describe('When rendered with default props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider)
    })

    it('Then it should render as a div element', () => {
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('Then it should apply base classes', () => {
      expect(wrapper.classes()).toContain('border-0')
    })

    it('Then it should apply horizontal orientation classes by default', () => {
      expect(wrapper.classes()).toContain('w-full')
    })

    it('Then it should apply base size class for horizontal divider', () => {
      expect(wrapper.classes()).toContain('h-px')
    })

    it('Then it should apply default margin class', () => {
      expect(wrapper.classes()).toContain('my-4')
    })

    it('Then it should have default background color style', () => {
      expect(wrapper.element.style.backgroundColor).toBe('rgb(229, 231, 235)')
    })
  })

  describe('When rendered with vertical orientation', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          orientation: 'vertical',
        },
      })
    })

    it('Then it should apply vertical orientation classes', () => {
      expect(wrapper.classes()).toContain('h-full')
    })

    it('Then it should apply base size class for vertical divider', () => {
      expect(wrapper.classes()).toContain('w-px')
    })

    it('Then it should not apply horizontal classes', () => {
      expect(wrapper.classes()).not.toContain('w-full')
      expect(wrapper.classes()).not.toContain('h-px')
    })
  })

  describe('When rendered with custom color prop', () => {
    let wrapper: VueWrapper
    const customColor = '#FF0000'

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          color: customColor,
        },
      })
    })

    it('Then it should apply the custom background color style', () => {
      expect(wrapper.element.style.backgroundColor).toBe('rgb(255, 0, 0)')
    })
  })

  describe('When rendered with custom margin prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          margin: 'mx-8 my-2',
        },
      })
    })

    it('Then it should apply the custom margin classes', () => {
      expect(wrapper.classes()).toContain('mx-8')
      expect(wrapper.classes()).toContain('my-2')
    })

    it('Then it should not apply the default margin class', () => {
      expect(wrapper.classes()).not.toContain('my-4')
    })
  })

  describe('When rendered with custom class prop', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          customClass: 'opacity-50 rounded',
        },
      })
    })

    it('Then it should apply the custom classes', () => {
      expect(wrapper.classes()).toContain('opacity-50')
      expect(wrapper.classes()).toContain('rounded')
    })
  })

  describe('When rendered with all horizontal size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const

    sizes.forEach((size) => {
      describe(`When horizontal size is ${size}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Divider, {
            props: {
              orientation: 'horizontal',
              size,
            },
          })
        })

        it(`Then it should apply the correct height class for ${size}`, () => {
          const expectedClasses = {
            xs: 'h-px',
            sm: 'h-0.5',
            base: 'h-px',
            lg: 'h-1',
            xl: 'h-1.5',
          }
          expect(wrapper.classes()).toContain(expectedClasses[size])
        })

        it('Then it should maintain horizontal orientation', () => {
          expect(wrapper.classes()).toContain('w-full')
        })
      })
    })
  })

  describe('When rendered with all vertical size variants', () => {
    const sizes = ['xs', 'sm', 'base', 'lg', 'xl'] as const

    sizes.forEach((size) => {
      describe(`When vertical size is ${size}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Divider, {
            props: {
              orientation: 'vertical',
              size,
            },
          })
        })

        it(`Then it should apply the correct width class for ${size}`, () => {
          const expectedClasses = {
            xs: 'w-px',
            sm: 'w-0.5',
            base: 'w-px',
            lg: 'w-1',
            xl: 'w-1.5',
          }
          expect(wrapper.classes()).toContain(expectedClasses[size])
        })

        it('Then it should maintain vertical orientation', () => {
          expect(wrapper.classes()).toContain('h-full')
        })
      })
    })
  })

  describe('When rendered with multiple custom props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          orientation: 'vertical',
          size: 'lg',
          color: '#0000FF',
          margin: 'mx-6',
          customClass: 'shadow-md',
        },
      })
    })

    it('Then it should apply all custom classes', () => {
      expect(wrapper.classes()).toContain('h-full')
      expect(wrapper.classes()).toContain('w-1')
      expect(wrapper.classes()).toContain('mx-6')
      expect(wrapper.classes()).toContain('shadow-md')
    })

    it('Then it should apply the custom color style', () => {
      expect(wrapper.element.style.backgroundColor).toBe('rgb(0, 0, 255)')
    })

    it('Then it should not apply default classes', () => {
      expect(wrapper.classes()).not.toContain('w-full')
      expect(wrapper.classes()).not.toContain('h-px')
      expect(wrapper.classes()).not.toContain('my-4')
    })
  })

  describe('When rendered with hex color variants', () => {
    const colorVariants = [
      { hex: '#E5E7EB', rgb: 'rgb(229, 231, 235)' },
      { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)' },
      { hex: '#000000', rgb: 'rgb(0, 0, 0)' },
      { hex: '#F3F4F6', rgb: 'rgb(243, 244, 246)' },
    ]

    colorVariants.forEach(({ hex, rgb }) => {
      describe(`When color is ${hex}`, () => {
        let wrapper: VueWrapper

        beforeEach(() => {
          wrapper = mount(Divider, {
            props: {
              color: hex,
            },
          })
        })

        it(`Then it should apply ${hex} color as ${rgb}`, () => {
          expect(wrapper.element.style.backgroundColor).toBe(rgb)
        })
      })
    })
  })

  describe('When rendered with empty custom class', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          customClass: '',
        },
      })
    })

    it('Then it should not add empty classes', () => {
      const classes = wrapper.element.className
      expect(classes).not.toMatch(/\s{2,}/) // No double spaces
      expect(classes).not.toMatch(/^\s|\s$/) // No leading/trailing spaces
    })

    it('Then it should still apply default classes', () => {
      expect(wrapper.classes()).toContain('border-0')
      expect(wrapper.classes()).toContain('w-full')
      expect(wrapper.classes()).toContain('h-px')
      expect(wrapper.classes()).toContain('my-4')
    })
  })

  describe('When rendered with no margin', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(Divider, {
        props: {
          margin: '',
        },
      })
    })

    it('Then it should not apply any margin classes', () => {
      const marginClasses = ['my-4', 'mx-4', 'm-4', 'mt-4', 'mb-4', 'ml-4', 'mr-4']
      marginClasses.forEach((marginClass) => {
        expect(wrapper.classes()).not.toContain(marginClass)
      })
    })

    it('Then it should still apply other default classes', () => {
      expect(wrapper.classes()).toContain('border-0')
      expect(wrapper.classes()).toContain('w-full')
      expect(wrapper.classes()).toContain('h-px')
    })
  })
})
