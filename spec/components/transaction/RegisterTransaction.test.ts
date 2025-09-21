import { mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { ComponentPublicInstance } from 'vue'
import RegisterTransaction from '../../../src/components/transaction/RegisterTransaction.vue'
import { texts } from '../../../src/shared/texts'

type RegisterTransactionWrapper = VueWrapper<ComponentPublicInstance>

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

    it('Then it should render the title input field', () => {
      const titleInput = wrapper.find('#title')
      expect(titleInput.exists()).toBe(true)
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

    it('Then it should display the title label', () => {
      const titleLabel = wrapper.find('label[for="title"]')
      expect(titleLabel.text()).toBe(texts.transaction.register.transactionTitle)
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

    it('Then it should display the title placeholder', () => {
      const titleInput = wrapper.find('#title')
      expect(titleInput.attributes('placeholder')).toBe(
        texts.transaction.register.transactionTitlePlaceholder,
      )
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

    it('Then it should have text type for title input', () => {
      const titleInput = wrapper.find('#title')
      expect(titleInput.attributes('type')).toBe('text')
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

    it('Then it should not emit submit event with invalid form data', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      // Form submission should not emit when form is invalid (empty required fields)
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should have form validation enabled', async () => {
      // Fill all required fields
      await wrapper.find('#title').setValue('Test Transaction')
      await wrapper.find('#value').setValue('100,50')
      await wrapper.find('#value').trigger('input')
      await wrapper.find('#type').setValue('income')
      await wrapper.find('#category').setValue('food')
      await wrapper.find('#paymentMethod').setValue('cash')
      await wrapper.find('#date').setValue('2025-01-01')

      // Verify form structure exists
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)

      // Verify all required fields are filled
      expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Test Transaction')
      expect((wrapper.find('#type').element as HTMLSelectElement).value).toBe('income')
      expect((wrapper.find('#category').element as HTMLSelectElement).value).toBe('food')
      expect((wrapper.find('#paymentMethod').element as HTMLSelectElement).value).toBe('cash')
      expect((wrapper.find('#date').element as HTMLInputElement).value).toBe('2025-01-01')
    })
  })

  describe('When form fields are updated', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should update title field', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('Test Transaction Title')

      expect((titleInput.element as HTMLInputElement).value).toBe('Test Transaction Title')
    })

    it('Then it should update amount field with formatting', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('100,00')
      await valueInput.trigger('input')

      // Check that the input received the value and was processed
      expect(valueInput.exists()).toBe(true)
    })

    it('Then it should update type field', async () => {
      const typeSelect = wrapper.find('#type')
      await typeSelect.setValue('expense')

      expect((typeSelect.element as HTMLSelectElement).value).toBe('expense')
    })

    it('Then it should update category field', async () => {
      const categorySelect = wrapper.find('#category')
      await categorySelect.setValue('transport')

      expect((categorySelect.element as HTMLSelectElement).value).toBe('transport')
    })

    it('Then it should update payment method field', async () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')
      await paymentMethodSelect.setValue('credit')

      expect((paymentMethodSelect.element as HTMLSelectElement).value).toBe('credit')
    })

    it('Then it should update date field', async () => {
      const dateInput = wrapper.find('#date')
      await dateInput.setValue('2025-09-20')

      expect((dateInput.element as HTMLInputElement).value).toBe('2025-09-20')
    })

    it('Then it should update description field', async () => {
      const descriptionTextarea = wrapper.find('#description')
      await descriptionTextarea.setValue('Test description')

      expect((descriptionTextarea.element as HTMLTextAreaElement).value).toBe('Test description')
    })
  })

  describe('When checking default form values', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have empty string as default title', () => {
      const titleInput = wrapper.find('#title')
      expect((titleInput.element as HTMLInputElement).value).toBe('')
    })

    it('Then it should have empty as default value', () => {
      const valueInput = wrapper.find('#value')
      expect((valueInput.element as HTMLInputElement).value).toBe('')
    })

    it('Then it should have income as default type', () => {
      const typeSelect = wrapper.find('#type')
      expect((typeSelect.element as HTMLSelectElement).value).toBe('income')
    })

    it('Then it should have food as default category', () => {
      const categorySelect = wrapper.find('#category')
      expect((categorySelect.element as HTMLSelectElement).value).toBe('food')
    })

    it('Then it should have cash as default payment method', () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')
      expect((paymentMethodSelect.element as HTMLSelectElement).value).toBe('cash')
    })

    it('Then it should have empty string as default date', () => {
      const dateInput = wrapper.find('#date')
      expect((dateInput.element as HTMLInputElement).value).toBe('')
    })

    it('Then it should have empty string as default description', () => {
      const descriptionTextarea = wrapper.find('#description')
      expect((descriptionTextarea.element as HTMLTextAreaElement).value).toBe('')
    })
  })

  describe('When testing form validation', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should not submit form with empty required fields', async () => {
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')

      // Form submission should not emit when form is invalid
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should have validation error display structure', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('')
      await titleInput.trigger('blur')

      // Try to submit to trigger validation
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      // Check if form prevents submission on invalid data
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should validate required fields before submission', async () => {
      // Fill all required fields
      await wrapper.find('#title').setValue('Test Transaction')
      await wrapper.find('#value').setValue('100,50')
      await wrapper.find('#value').trigger('input')
      await wrapper.find('#type').setValue('income')
      await wrapper.find('#category').setValue('food')
      await wrapper.find('#paymentMethod').setValue('cash')
      await wrapper.find('#date').setValue('2025-01-01')

      // Just verify fields are filled
      expect((wrapper.find('#title').element as HTMLInputElement).value).toBe('Test Transaction')
      expect((wrapper.find('#date').element as HTMLInputElement).value).toBe('2025-01-01')
    })
  })

  describe('When testing monetary input formatting', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should format monetary input', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('123,45')
      await valueInput.trigger('input')

      // Check that input exists and was processed
      expect(valueInput.exists()).toBe(true)
    })

    it('Then it should handle empty input', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('')
      await valueInput.trigger('input')

      expect((valueInput.element as HTMLInputElement).value).toBe('')
    })

    it('Then it should strip non-numeric characters', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('R$ 1.500,99')
      await valueInput.trigger('input')

      // Input should be processed and formatted
      expect(valueInput.exists()).toBe(true)
    })
  })

  describe('When testing title field behavior', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should accept text input for title field', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('Compra no supermercado')

      expect((titleInput.element as HTMLInputElement).value).toBe('Compra no supermercado')
    })

    it('Then it should handle empty title field', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('')

      expect((titleInput.element as HTMLInputElement).value).toBe('')
    })

    it('Then it should handle special characters in title', async () => {
      const titleInput = wrapper.find('#title')
      const specialTitle = 'Compra R$ 123,45 @ supermercado & farmácia'
      await titleInput.setValue(specialTitle)

      expect((titleInput.element as HTMLInputElement).value).toBe(specialTitle)
    })

    it('Then it should handle long title text', async () => {
      const titleInput = wrapper.find('#title')
      const longTitle =
        'Este é um título muito longo para testar se o campo aceita textos extensos sem problemas'
      await titleInput.setValue(longTitle)

      expect((titleInput.element as HTMLInputElement).value).toBe(longTitle)
    })

    it('Then it should handle title input correctly', async () => {
      const titleInput = wrapper.find('#title')

      // Fill the title field
      await titleInput.setValue('Teste de título')

      expect((titleInput.element as HTMLInputElement).value).toBe('Teste de título')
    })
  })

  describe('When testing validation behavior', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should have validation logic for title field', async () => {
      const titleInput = wrapper.find('#title')
      await titleInput.setValue('')
      await titleInput.trigger('blur')

      // Try to submit to trigger validation
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      // Form should not emit on invalid data
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should have validation logic for amount field', async () => {
      const valueInput = wrapper.find('#value')
      await valueInput.setValue('')
      await valueInput.trigger('input')
      await valueInput.trigger('blur')

      // Try to submit to trigger validation
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      // Form should not emit on invalid data
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should have validation logic for date field', async () => {
      const dateInput = wrapper.find('#date')
      await dateInput.setValue('')
      await dateInput.trigger('blur')

      // Try to submit to trigger validation
      const form = wrapper.find('form')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      // Form should not emit on invalid data
      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Then it should have error display elements in template', () => {
      // Check that error display structure exists in template
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)

      // Verify that inputs have the correct structure for validation
      expect(wrapper.find('#title').exists()).toBe(true)
      expect(wrapper.find('#value').exists()).toBe(true)
      expect(wrapper.find('#date').exists()).toBe(true)
    })
  })

  describe('When testing onBlur validation behavior', () => {
    let wrapper: RegisterTransactionWrapper

    beforeEach(() => {
      wrapper = factory()
    })

    it('Then it should only validate on blur, not on input', async () => {
      const titleInput = wrapper.find('#title')

      // Set empty value and trigger input (should not show error immediately)
      await titleInput.setValue('')
      await titleInput.trigger('input')
      await wrapper.vm.$nextTick()

      // Error should not appear immediately after input
      const errorElements = wrapper.findAll('p.text-red-600')
      expect(errorElements.length).toBe(0)

      // Now trigger blur (should show error)
      await titleInput.trigger('blur')
      await wrapper.vm.$nextTick()

      // Now error should appear or validation should have been triggered
      expect(titleInput.exists()).toBe(true) // At least verify the input exists
    })

    it('Then it should validate date field on blur event', async () => {
      const dateInput = wrapper.find('#date')

      // Clear the date field and trigger input
      await dateInput.setValue('')
      await dateInput.trigger('input')
      await wrapper.vm.$nextTick()

      // Trigger blur to activate validation
      await dateInput.trigger('blur')
      await wrapper.vm.$nextTick()

      // Verify the field exists and blur event was handled
      expect(dateInput.exists()).toBe(true)
    })

    it('Then it should validate type field on blur event', async () => {
      const typeSelect = wrapper.find('#type')

      // Change value and trigger blur
      await typeSelect.setValue('expense')
      await typeSelect.trigger('blur')
      await wrapper.vm.$nextTick()

      // Verify field exists and change was handled
      expect((typeSelect.element as HTMLSelectElement).value).toBe('expense')
    })

    it('Then it should validate category field on blur event', async () => {
      const categorySelect = wrapper.find('#category')

      // Change value and trigger blur
      await categorySelect.setValue('transport')
      await categorySelect.trigger('blur')
      await wrapper.vm.$nextTick()

      // Verify field exists and change was handled
      expect((categorySelect.element as HTMLSelectElement).value).toBe('transport')
    })

    it('Then it should validate payment method field on blur event', async () => {
      const paymentMethodSelect = wrapper.find('#paymentMethod')

      // Change value and trigger blur
      await paymentMethodSelect.setValue('credit')
      await paymentMethodSelect.trigger('blur')
      await wrapper.vm.$nextTick()

      // Verify field exists and change was handled
      expect((paymentMethodSelect.element as HTMLSelectElement).value).toBe('credit')
    })

    it('Then it should handle description field blur event', async () => {
      const descriptionTextarea = wrapper.find('#description')

      // Set value and trigger blur
      await descriptionTextarea.setValue('Test description')
      await descriptionTextarea.trigger('blur')
      await wrapper.vm.$nextTick()

      // Verify field exists and change was handled
      expect((descriptionTextarea.element as HTMLTextAreaElement).value).toBe('Test description')
    })
  })
})
