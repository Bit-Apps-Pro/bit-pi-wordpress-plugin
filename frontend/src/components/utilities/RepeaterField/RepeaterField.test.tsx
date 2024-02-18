import ComponentName from '@common/globalStates/flows/ComponentNameType'
import { cleanup, fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import RepeaterField from './RepeaterField'

const fieldsMetaData = [
  {
    componentName: ComponentName.select,
    label: 'Question',
    name: 'question',
    value: '',
    options: [
      { label: 'A', value: 'A' },
      { label: 'B', value: 'B' },
      { label: 'C', value: 'C', disabled: true }
    ],
    required: true,
    style: { width: 100 }
  },
  {
    componentName: ComponentName.input,
    label: 'Answer',
    name: 'answer',
    value: '',
    required: true,
    wrapperClassName: 'w-100',
    onBlur: console.log
  }
]

describe('test RepeaterField component', () => {
  beforeEach(cleanup)

  it('should render RepeaterField component', () => {
    render(<RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} />)
    screen.getByTestId('add-item')
  })

  it('should add item when click add item button', () => {
    render(<RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} />)
    const addButton = screen.getByTestId('add-item')
    expect(screen.queryAllByTestId('delete-item').length).toBe(0)

    fireEvent.click(addButton)
    expect(screen.getAllByTestId('delete-item').length).toBe(1)
  })

  it('should render inputs based on fields metadata', () => {
    render(<RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} />)
    const addButton = screen.getByTestId('add-item')
    fireEvent.click(addButton)

    screen.getByText('Question')
    screen.getByText('Answer')
  })

  it('should remove fields when remove button is clicked', async () => {
    const { getByTestId, queryByTestId } = render(
      <RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} />
    )
    const addButton = getByTestId('add-item')
    fireEvent.click(addButton)

    const removeButton = getByTestId('delete-item')
    fireEvent.click(removeButton)

    await waitForElementToBeRemoved(removeButton, {
      timeout: 3000
    })

    const getRemoveBtn = queryByTestId('delete-item')
    expect(getRemoveBtn).toBeNull()
  })

  // it('should call onChange when input value is changed', () => {
  //   const onChange = vitest.fn(data => {
  //     if (data[0]?.[0]?.value !== '') {
  //       expect(data[0][0].value).toBe('test')
  //     }
  //   })

  //   render(<RepeaterField label="test" onChange={onChange} fieldsMetaData={fieldsMetaData} />)
  //   const addButton = screen.getByTestId('add-item')
  //   fireEvent.click(addButton)

  //   const input1 = screen.getByLabelText('Question')
  //   fireEvent.change(input1, { target: { value: 'test' } })
  //   expect(onChange).toHaveBeenCalled()
  // })

  // it('should call onChange when select value is changed', () => {
  //   const onChange = vitest.fn(data => {
  //     if (data[0]?.inputs[1]?.value !== '') {
  //       expect(data[0].inputs[1].value).toBe('yes')
  //     }
  //   })

  //   render(<RepeaterField label="test" onChange={onChange} fieldsMetaData={fieldsMetaData} />)
  //   const addButton = screen.getByTestId('add-item')
  //   fireEvent.click(addButton)

  //   const select = screen.getByLabelText('Answer')
  //   fireEvent.change(select, { target: { value: 'yes' } })
  //   expect(onChange).toHaveBeenCalled()
  // })

  it('should not add item when maxGroup is reached', async () => {
    render(
      <RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} maxGroup={1} />
    )
    const addButton = screen.getByTestId('add-item')
    expect(addButton.hasAttribute('disabled')).toBeFalsy()

    fireEvent.click(addButton)
    fireEvent.click(addButton)

    expect(addButton.hasAttribute('disabled')).toBeTruthy()
    expect(screen.getAllByTestId('delete-item').length).toBe(1)
  })

  // it('should not delete item when minGroup is reached', async () => {
  //   render(
  //     <RepeaterField label="test" onChange={() => {}} fieldsMetaData={fieldsMetaData} minGroup={1} />
  //   )
  //   const addButton = screen.getByTestId('add-item')
  //   fireEvent.click(addButton)
  //   fireEvent.click(addButton)
  //   fireEvent.click(addButton)

  //   let removeButtons = screen.getAllByTestId('delete-item')
  //   expect(removeButtons.length).toBe(3)
  //   fireEvent.click(removeButtons[0])
  //   await waitForElementToBeRemoved(removeButtons[0], {
  //     timeout: 1000
  //   })

  //   removeButtons = screen.getAllByTestId('delete-item')
  //   expect(removeButtons.length).toBe(2)
  //   fireEvent.click(removeButtons[0])
  //   await waitForElementToBeRemoved(removeButtons[0], {
  //     timeout: 1000
  //   })

  //   removeButtons = screen.getAllByTestId('delete-item')
  //   expect(removeButtons.length).toBe(1)
  //   expect(removeButtons[0].hasAttribute('disabled')).toBeTruthy()
  // })
})
