import { type ChangeEvent, useEffect, useState } from 'react'

import LucideIcn from '@icons/LucideIcn'
import ut from '@resource/utilsCssInJs'
import Input from '@utilities/Input'
import MixInput from '@utilities/MixInput'
import Select from '@utilities/Select'
import { Button, Typography, theme } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'

import { type RepeaterFieldPropsType, type ValueType } from './RepeaterFieldType'
import {
  addRepeaterField,
  createRepeaterValue,
  deleteRepeaterField,
  getUpdatedRepeaterField,
  isInputField,
  isMixInputField,
  isSelectField
} from './helpers/helpers'

export default function RepeaterField({
  label,
  minGroup = 0,
  maxGroup,
  value,
  fieldsMetaData,
  inputGroupProps,
  deleteBtnProps,
  addItemButtonLabel,
  wrapperClassName,
  onChange,
  onRender
}: RepeaterFieldPropsType) {
  const [repeaterFields, setRepeaterFields] = useState<ValueType[]>([])

  const { token } = theme.useToken()

  const isMinItemReached = () => repeaterFields.length <= minGroup

  const isMaxItemReached = () => typeof maxGroup !== 'undefined' && repeaterFields.length >= maxGroup

  const handleAddItem = () => {
    if (isMaxItemReached()) return

    const { values, newRepeaterField } = addRepeaterField(
      repeaterFields,
      fieldsMetaData,
      inputGroupProps
    )

    setRepeaterFields(newRepeaterField)
    onChange(values)
  }

  const handleDeleteItem = (inputGroupIndex: number) => () => {
    if (isMinItemReached()) return

    const { values, repeaterFieldAfterDelete } = deleteRepeaterField(repeaterFields, inputGroupIndex)
    setRepeaterFields(repeaterFieldAfterDelete)
    onChange(values)
  }

  const updateState = (
    inputGroupIndex: number,
    inputIndex: number,
    inputValue: string | number | MappedValueType[] | []
  ) => {
    const { values, updatedRepeaterField } = getUpdatedRepeaterField(
      repeaterFields,
      inputGroupIndex,
      inputIndex,
      inputValue
    )
    setRepeaterFields(updatedRepeaterField)
    onChange(values)
  }

  const handleInputChange =
    (inputIndex: number, inputGroupIndex: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const { value: inputValue } = e.target

      updateState(inputGroupIndex, inputIndex, inputValue)
    }

  const handleChange =
    (inputIndex: number, inputGroupIndex: number) => (inputValue: string | number | []) => {
      updateState(inputGroupIndex, inputIndex, inputValue)
    }

  const handleMixInputChange =
    (inputIndex: number, inputGroupIndex: number) => (inputValue: MappedValueType[]) => {
      updateState(inputGroupIndex, inputIndex, inputValue)
    }

  useEffect(() => {
    setRepeaterFields(createRepeaterValue(value || [], fieldsMetaData, inputGroupProps))
  }, [fieldsMetaData])

  useEffect(() => {
    onRender?.()
  }, [])

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor="repeater" className="mb-1 d-ib" css={{ color: token.colorText }}>
          {label}
        </label>
      )}

      <AnimatePresence>
        {repeaterFields.map((inputGroup, inputGroupIndex) => (
          <motion.div
            layout
            key={`inputGroup-${inputGroupIndex + 10}`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {inputGroup?.label && (
              <Typography.Text className="ml-3">
                {inputGroup.label.includes('#{COUNT}')
                  ? inputGroup.label.replace('#{COUNT}', String(inputGroupIndex + 1))
                  : inputGroup.label}
              </Typography.Text>
            )}

            <div
              className={`ml-3 mb-2 flx ai-end gap-2 ${inputGroupProps?.className}`}
              style={inputGroupProps?.style}
            >
              {inputGroup.inputs.map((input, inputIndex) => {
                if (isInputField(input)) {
                  const { componentName, ...restInputProps } = input
                  return (
                    <Input
                      key={`${componentName}_${inputIndex + 10}`}
                      onChange={handleInputChange(inputIndex, inputGroupIndex)}
                      {...restInputProps} // eslint-disable-line react/jsx-props-no-spreading
                    />
                  )
                }

                if (isSelectField(input)) {
                  const { componentName, ...restInputProps } = input
                  return (
                    <Select
                      key={`${componentName}_${inputIndex + 10}`}
                      onChange={handleChange(inputIndex, inputGroupIndex)}
                      {...restInputProps} // eslint-disable-line react/jsx-props-no-spreading
                    />
                  )
                }

                if (isMixInputField(input)) {
                  const { componentName, ...restInputProps } = input
                  return (
                    <MixInput
                      key={`${componentName}_${inputIndex + 10}`}
                      onChange={handleMixInputChange(inputIndex, inputGroupIndex)}
                      {...restInputProps} // eslint-disable-line react/jsx-props-no-spreading
                    />
                  )
                }
              })}

              <Button
                size="small"
                data-testid="delete-item"
                icon={<LucideIcn name="trash-2" />}
                onClick={handleDeleteItem(inputGroupIndex)}
                disabled={isMinItemReached()}
                css={ut({ mnw: '24px*', mb: 3 })}
                style={deleteBtnProps?.style}
                className={deleteBtnProps?.className}
              />
            </div>
          </motion.div>
        ))}

        <motion.div layout transition={{ duration: 0.2 }}>
          <Button
            icon={<LucideIcn name="plus" />}
            data-testid="add-item"
            onClick={handleAddItem}
            disabled={isMaxItemReached()}
          >
            {addItemButtonLabel}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
