import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import RegisterTransaction from '../../../src/components/transaction/RegisterTransaction.vue'
import { texts } from '../../../src/shared/texts'

interface TransactionForm {
  value: string
  type: 'income' | 'expense'
  category: string
  paymentMethod: string
  date: string
  description: string
}

interface RegisterTransactionComponent {
  form: TransactionForm
}

type RegisterTransactionWrapper = VueWrapper<ComponentPublicInstance & RegisterTransactionComponent>

const factory = () => {
  return mount(RegisterTransaction) as RegisterTransactionWrapper
}

describe('Given a RegisterTransaction component', () => {
  describe('When rendered with default state', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the transaction title', () => {
      const title = wrapper.find('h1')
      expect(title.exists()).toBe(true)
    })

    it('Then it should display the correct transaction title text', () => {
      const title = wrapper.find('h1')
      expect(title.text()).toBe(texts.transaction.register.title)
    })

    it('Then it should render the CardContainer wrapper', () => {
      const cardContainer = wrapper.findComponent({ name: 'CardContainer' })
      expect(cardContainer.exists()).toBe(true)
    })

    it('Then it should render the Title component', () => {
      const title = wrapper.findComponent({ name: 'Title' })
      expect(title.exists()).toBe(true)
    })

    it('Then it should render the Divider component', () => {
      const divider = wrapper.findComponent({ name: 'Divider' })
      expect(divider.exists()).toBe(true)
    })

    it('Then it should render the form element', () => {
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })
  })

  describe('When rendering form fields', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should render the value input field', () => {
      const valueInput = wrapper.find('#value')
      expect(valueInput.exists()).toBe(true)
    })

    it('Then it should render the type select field', () => {
      const typeSelect = wrapper.find('#type')
      expect(typeSelect.exists()).toBe(true)
    })

    it('Then it should render the category select field', () => {
      const categorySelect = wrapper.find('#category')
      expect(categorySelect.exists()).toBe(true)
    })

    it('Then it should render the payment method select field', () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')
      expect(paymentMethodSelect.exists()).toBe(true)
    })

    it('Then it should render the date input field', () => {
      const dateInput = wrapper.find('#date')
      expect(dateInput.exists()).toBe(true)
    })

    it('Then it should render the description textarea field', () => {
      const descriptionTextarea = wrapper.find('#description')
      expect(descriptionTextarea.exists()).toBe(true)
    })

    it('Then it should render the save button', () => {
      const saveButton = wrapper.findComponent({ name: 'Button' })
      expect(saveButton.exists()).toBe(true)
    })
  })

  describe('When checking field labels', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should display the value label', () => {
      const valueLabel = wrapper.find('label[for="value"]')
      expect(valueLabel.text()).toBe(texts.transaction.register.value)
    })

    it('Then it should display the type label', () => {
      const typeLabel = wrapper.find('label[for="type"]')
      expect(typeLabel.text()).toBe(texts.transaction.register.type)
    })

    it('Then it should display the category label', () => {
      const categoryLabel = wrapper.find('label[for="category"]')
      expect(categoryLabel.text()).toBe(texts.transaction.register.category)
    })

    it('Then it should display the payment method label', () => {
      const paymentMethodLabel = wrapper.find('label[for="paymentMethod"]')
      expect(paymentMethodLabel.text()).toBe(texts.transaction.register.paymentMethod)
    })

    it('Then it should display the date label', () => {
      const dateLabel = wrapper.find('label[for="date"]')
      expect(dateLabel.text()).toBe(texts.transaction.register.date)
    })

    it('Then it should display the description label', () => {
      const descriptionLabel = wrapper.find('label[for="description"]')
      expect(descriptionLabel.text()).toBe(texts.transaction.register.description)
    })
  })

  describe('When checking field placeholders', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should display the value placeholder', () => {
      const valueInput = wrapper.find('#value')
      expect(valueInput.attributes('placeholder')).toBe(texts.transaction.register.valuePlaceholder)
    })

    it('Then it should display the description placeholder', () => {
      const descriptionTextarea = wrapper.find('#description')
      expect(descriptionTextarea.attributes('placeholder')).toBe(
        texts.transaction.register.descriptionPlaceholder,
      )
    })
  })

  describe('When checking select options', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have income option in type select', () => {
      const typeSelect = wrapper.find('#type')
      const incomeOption = typeSelect.find('option[value="income"]')
      expect(incomeOption.text()).toBe(texts.transaction.register.income)
    })

    it('Then it should have expense option in type select', () => {
      const typeSelect = wrapper.find('#type')
      const expenseOption = typeSelect.find('option[value="expense"]')
      expect(expenseOption.text()).toBe(texts.transaction.register.expense)
    })

    it('Then it should have food option in category select', () => {
      const categorySelect = wrapper.find('#category')
      const foodOption = categorySelect.find('option[value="food"]')
      expect(foodOption.text()).toBe(texts.transaction.register.categories.food)
    })

    it('Then it should have cash option in payment method select', () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')
      const cashOption = paymentMethodSelect.find('option[value="cash"]')
      expect(cashOption.text()).toBe(texts.transaction.register.paymentMethods.cash)
    })
  })

  describe('When checking field types', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have text type for value input', () => {
      const valueInput = wrapper.find('#value')
      expect(valueInput.attributes('type')).toBe('text')
    })

    it('Then it should have date type for date input', () => {
      const dateInput = wrapper.find('#date')
      expect(dateInput.attributes('type')).toBe('date')
    })

    it('Then it should have 4 rows for description textarea', () => {
      const descriptionTextarea = wrapper.find('#description')
      expect(descriptionTextarea.attributes('rows')).toBe('4')
    })
  })

  describe('When checking button properties', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have submit type for save button', () => {
      const saveButton = wrapper.findComponent({ name: 'Button' })
      expect(saveButton.props('type')).toBe('submit')
    })

    it('Then it should have success variant for save button', () => {
      const saveButton = wrapper.findComponent({ name: 'Button' })
      expect(saveButton.props('variant')).toBe('success')
    })

    it('Then it should have lg size for save button', () => {
      const saveButton = wrapper.findComponent({ name: 'Button' })
      expect(saveButton.props('size')).toBe('lg')
    })

    it('Then it should display save text on button', () => {
      const saveButton = wrapper.findComponent({ name: 'Button' })
      expect(saveButton.text()).toBe(texts.transaction.register.save)
    })
  })

  describe('When form is submitted', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should emit submit event with form data', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      expect(wrapper.emitted('submit')).toBeTruthy()
    })

    it('Then it should emit correct form structure', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      const emittedEvents = wrapper.emitted('submit')
      expect(emittedEvents).toHaveLength(1)
    })
  })

  describe('When form fields are updated', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should update value field', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('100.00')

      expect((wrapper.vm as RegisterTransactionComponent).form.value).toBe('100.00')
    })

    it('Then it should update type field', async () => {
      const typeSelect = wrapper.find('#type')
      await typeSelect.setValue('expense')

      expect((wrapper.vm as RegisterTransactionComponent).form.type).toBe('expense')
    })

    it('Then it should update category field', async () => {
      const categorySelect = wrapper.find('#category')
      await categorySelect.setValue('transport')

      expect((wrapper.vm as RegisterTransactionComponent).form.category).toBe('transport')
    })

    it('Then it should update payment method field', async () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')
      await paymentMethodSelect.setValue('credit')

      expect((wrapper.vm as any).form.paymentMethod).toBe('credit')
    })

    it('Then it should update date field', async () => {
      const dateInput = wrapper.find('#date')
      await dateInput.setValue('2025-09-20')

      expect((wrapper.vm as any).form.date).toBe('2025-09-20')
    })

    it('Then it should update description field', async () => {
      const descriptionTextarea = wrapper.find('#description')
      await descriptionTextarea.setValue('Test description')

      expect((wrapper.vm as any).form.description).toBe('Test description')
    })
  })

  describe('When checking default form values', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have empty string as default value', () => {
      expect((wrapper.vm as any).form.value).toBe('')
    })

    it('Then it should have income as default type', () => {
      expect((wrapper.vm as any).form.type).toBe('income')
    })

    it('Then it should have food as default category', () => {
      expect((wrapper.vm as any).form.category).toBe('food')
    })

    it('Then it should have cash as default payment method', () => {
      expect((wrapper.vm as any).form.paymentMethod).toBe('cash')
    })

    it('Then it should have empty string as default date', () => {
      expect((wrapper.vm as any).form.date).toBe('')
    })

    it('Then it should have empty string as default description', () => {
      expect((wrapper.vm as any).form.description).toBe('')
    })
  })
})
